import os
import struct
import zlib

def create_og_preview_png(out_path: str):
    """Generates a 1200x630 1994 CRT retro Oscilloscope & Amber Phosphor social preview PNG using pure Python stdlib."""
    width, height = 1200, 630
    import math

    # Build RGB pixel buffer with CRT dark background, grid lines, phosphor dual-trace waveform, and amber border
    rows = []
    mid_y = height // 2 + 20

    for y in range(height):
        row = bytearray()
        row.append(0)  # PNG filter type 0
        scanline_dim = 0.82 if (y % 3 == 0) else 1.0

        for x in range(width):
            # Base dark CRT background (#070a0f)
            r, g, b = 7, 10, 15

            # Outer Amber Frame Border
            if (20 <= x <= width - 20 and (20 <= y <= 24 or height - 24 <= y <= height - 20)) or (
                20 <= y <= height - 20 and (20 <= x <= 24 or width - 24 <= x <= width - 20)
            ):
                r, g, b = 245, 158, 11
            # Inner Oscilloscope Grid
            elif 60 <= x <= width - 60 and 60 <= y <= height - 60:
                if x % 40 == 0 or y % 40 == 0:
                    r, g, b = 12, 38, 24

                # Trace A: Emerald Green Sine Wave
                wave_a = int(mid_y - 35 + math.sin(x * 0.025) * math.cos(x * 0.008) * 75)
                if abs(y - wave_a) <= 2:
                    r, g, b = 52, 211, 153
                elif abs(y - wave_a) <= 6:
                    r, g, b = max(r, 16), max(g, 95), max(b, 65)

                # Trace B: Amber Gold Counter-Wave
                wave_b = int(mid_y + 40 + math.sin(x * 0.025 + 1.4) * math.cos(x * 0.008 - 0.8) * 65)
                if abs(y - wave_b) <= 2:
                    r, g, b = 245, 158, 11
                elif abs(y - wave_b) <= 6:
                    r, g, b = max(r, 110), max(g, 65), max(b, 10)

            row.extend((int(r * scanline_dim), int(g * scanline_dim), int(b * scanline_dim)))
        rows.append(bytes(row))

    raw_data = b"".join(rows)

    def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
        chunk = chunk_type + data
        return struct.pack("!I", len(data)) + chunk + struct.pack("!I", zlib.crc32(chunk) & 0xFFFFFFFF)

    ihdr = struct.pack("!IIBBBBB", width, height, 8, 2, 0, 0, 0)
    idat = zlib.compress(raw_data, 9)
    png_bytes = b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", ihdr) + png_chunk(b"IDAT", idat) + png_chunk(b"IEND", b"")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(png_bytes)
    print(f"Generated {out_path} ({len(png_bytes)} bytes)")

def create_pwa_icon_png(out_path: str, size: int):
    """Generates a square retro 1994 CRT Radar & Oscilloscope PNG icon of given size."""
    import math
    width = height = size
    cx = cy = size / 2.0
    rows = []

    for y in range(height):
        row = bytearray([0])
        scanline_dim = 0.85 if (y % 3 == 0) else 1.0
        for x in range(width):
            r, g, b = 9, 13, 19
            dx = x - cx
            dy = y - cy
            dist = math.hypot(dx, dy)

            # Outer rounded amber bezel
            margin = size * 0.06
            if (margin <= x <= size - margin and (abs(y - margin) <= size * 0.018 or abs(y - (size - margin)) <= size * 0.018)) or (
                margin <= y <= size - margin and (abs(x - margin) <= size * 0.018 or abs(x - (size - margin)) <= size * 0.018)
            ):
                r, g, b = 245, 158, 11
            else:
                # Radar concentric rings
                for ring_mult in (0.18, 0.30, 0.40):
                    if abs(dist - size * ring_mult) <= max(1.5, size * 0.012):
                        r, g, b = 245, 158, 11

                # Center glowing radio beacon dot
                if dist <= size * 0.065:
                    r, g, b = 52, 211, 153
                elif dist <= size * 0.095:
                    r, g, b = 16, 120, 80

                # Oscilloscope wave across center
                if margin * 1.5 <= x <= size - margin * 1.5:
                    wave_y = cy + math.sin((x / size) * math.pi * 4) * (size * 0.11)
                    if abs(y - wave_y) <= max(1.8, size * 0.016):
                        r, g, b = 52, 211, 153

            row.extend((int(r * scanline_dim), int(g * scanline_dim), int(b * scanline_dim)))
        rows.append(bytes(row))

    raw_data = b"".join(rows)

    def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
        chunk = chunk_type + data
        return struct.pack("!I", len(data)) + chunk + struct.pack("!I", zlib.crc32(chunk) & 0xFFFFFFFF)

    ihdr = struct.pack("!IIBBBBB", width, height, 8, 2, 0, 0, 0)
    idat = zlib.compress(raw_data, 9)
    png_bytes = b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", ihdr) + png_chunk(b"IDAT", idat) + png_chunk(b"IEND", b"")

    with open(out_path, "wb") as f:
        f.write(png_bytes)
    print(f"Generated {out_path} ({len(png_bytes)} bytes)")


if __name__ == "__main__":
    create_og_preview_png(os.path.join("public", "og-preview.png"))
    create_pwa_icon_png(os.path.join("public", "pwa-192x192.png"), 192)
    create_pwa_icon_png(os.path.join("public", "pwa-512x512.png"), 512)
    create_pwa_icon_png(os.path.join("public", "apple-touch-icon.png"), 180)

