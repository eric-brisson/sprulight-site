import AppKit
import CoreText

let arguments = CommandLine.arguments
guard arguments.count == 4 else {
    print("usage: swift make-images.swift <icon.png> <fonts-folder-with-ttf> <docs/assets-folder>")
    exit(1)
}
let iconPath = arguments[1]
let fontsFolder = arguments[2]
let assets = URL(fileURLWithPath: arguments[3])

guard let iconImage = NSImage(contentsOfFile: iconPath),
      let icon = iconImage.cgImage(forProposedRect: nil, context: nil, hints: nil)
else {
    print("can't read \(iconPath)")
    exit(1)
}

for name in ["Barlow-Bold", "Barlow-Medium"] {
    let url = URL(fileURLWithPath: fontsFolder).appendingPathComponent("\(name).ttf")
    CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
}

let slate = CGColor(red: 0x1D / 255, green: 0x23 / 255, blue: 0x2A / 255, alpha: 1)
let textColor = CGColor(red: 0xE4 / 255, green: 0xEC / 255, blue: 0xF5 / 255, alpha: 1)
let mutedColor = CGColor(red: 0x8E / 255, green: 0xA2 / 255, blue: 0xB8 / 255, alpha: 1)

func png(width: Int, height: Int, _ draw: (CGContext) -> Void) -> Data {
    let context = CGContext(
        data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpace(name: CGColorSpace.sRGB)!,
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.interpolationQuality = .high
    draw(context)
    let rep = NSBitmapImageRep(cgImage: context.makeImage()!)
    return rep.representation(using: .png, properties: [:])!
}

func write(_ data: Data, _ relativePath: String) throws {
    let url = assets.appendingPathComponent(relativePath)
    try FileManager.default.createDirectory(
        at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    try data.write(to: url)
    print("wrote \(relativePath)")
}

func drawText(_ text: String, fontName: String, size: CGFloat, color: CGColor,
              at point: CGPoint, in context: CGContext) {
    let font = CTFontCreateWithName(fontName as CFString, size, nil)
    let attributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTForegroundColorAttributeName as String): color,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attributes))
    context.textPosition = point
    CTLineDraw(line, context)
}

for size in [32, 96, 192, 512] {
    let name = size == 32 ? "favicon-32.png" : "icon-\(size).png"
    try write(png(width: size, height: size) { context in
        context.draw(icon, in: CGRect(x: 0, y: 0, width: size, height: size))
    }, "icons/\(name)")
}

try write(png(width: 180, height: 180) { context in
    context.setFillColor(slate)
    context.fill(CGRect(x: 0, y: 0, width: 180, height: 180))
    let scaled: CGFloat = 180 * 1.06
    let offset = (180 - scaled) / 2
    context.draw(icon, in: CGRect(x: offset, y: offset, width: scaled, height: scaled))
}, "icons/apple-touch-icon.png")

try write(png(width: 1200, height: 630) { context in
    context.setFillColor(slate)
    context.fill(CGRect(x: 0, y: 0, width: 1200, height: 630))
    context.draw(icon, in: CGRect(x: 100, y: 135, width: 360, height: 360))
    drawText("SpruLight", fontName: "Barlow-Bold", size: 104, color: textColor,
             at: CGPoint(x: 530, y: 320), in: context)
    drawText("Miniature painting tracker", fontName: "Barlow-Medium", size: 44, color: mutedColor,
             at: CGPoint(x: 534, y: 250), in: context)
}, "og-image.png")
