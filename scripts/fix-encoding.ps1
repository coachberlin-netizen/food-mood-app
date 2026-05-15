
$files = @(
    'src\app\retos\recupera-tu-energia\page.tsx',
    'src\app\retos\equilibrio-hormonal-45\page.tsx',
    'src\app\retos\microhabitos\page.tsx',
    'src\app\retos\slow-food-mood\page.tsx',
    'src\app\retos\activa-tu-longevidad\page.tsx',
    'src\app\retos\reset-antiinflamatorio\page.tsx'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Build search strings using char codes only (no literal non-ASCII in script)
$A3 = [char]0x00C3  # A-tilde (Ã)
$A2 = [char]0x00C2  # A-circumflex (Â)
$ae = [char]0x00E2  # a-circumflex (â)
$euro = [char]0x20AC  # euro sign (part of garbled â€x sequences)

# Garbled search -> correct replacement pairs [search, replacement]
$pairs = @(
    # Ã + second byte pairs (Spanish accented lowercase)
    @($A3 + [char]0x00A1, [char]0x00E1),  # Ã¡ -> a
    @($A3 + [char]0x00A9, [char]0x00E9),  # Ã© -> e
    @($A3 + [char]0x00AD, [char]0x00ED),  # Ã­ -> i
    @($A3 + [char]0x00B3, [char]0x00F3),  # Ã³ -> o
    @($A3 + [char]0x00BA, [char]0x00FA),  # Ãº -> u
    @($A3 + [char]0x00B1, [char]0x00F1),  # Ã± -> n
    @($A3 + [char]0x00BC, [char]0x00FC),  # Ã¼ -> u-umlaut
    @($A3 + [char]0x00A7, [char]0x00E7),  # Ã§ -> c-cedilla
    @($A3 + [char]0x00A8, [char]0x00E8),  # Ã¨ -> e-grave
    # Â + second byte pairs
    @($A2 + [char]0x00B7, [char]0x00B7),  # Â· -> middle-dot
    @($A2 + [char]0x00BF, [char]0x00BF),  # Â¿ -> inv-?
    @($A2 + [char]0x00A1, [char]0x00A1),  # Â¡ -> inv-!
    @($A2 + [char]0x00BA, [char]0x00BA),  # Âº -> ordinal-o
    @($A2 + [char]0x00B0, [char]0x00B0),  # Â° -> degree
    @($A2 + [char]0x00A3, [char]0x00A3),  # Â£ -> pound
    @($A2 + [char]0x00A7, [char]0x00A7),  # Â§ -> section
    @($A2 + [char]0x00A9, [char]0x00A9),  # Â© -> copyright
    @($A2 + [char]0x00AE, [char]0x00AE),  # Â® -> registered
    # â€ + third byte (dashes, quotes)
    @($ae + $euro + [char]0x201D, [char]0x2014),  # â€" (right curly) -> em-dash
    @($ae + $euro + [char]0x201C, [char]0x2013),  # â€" (left curly)  -> en-dash
    @($ae + $euro + '"',          [char]0x2014),  # â€" (ASCII quote)  -> em-dash fallback
    @($ae + $euro + [char]0x2122, [char]0x2019),  # â€™ -> right-single-curly
    @($ae + $euro + [char]0x02DC, [char]0x2018),  # â€˜ -> left-single-curly
    @($ae + $euro + [char]0x00A2, [char]0x2022),  # â€¢ -> bullet
    # â + ‚ + ¬  -> euro  (E2 82 AC)
    @($ae + [char]0x201A + [char]0x00AC, [char]0x20AC)  # â‚¬ -> euro-sign
)

foreach ($file in $files) {
    $c = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    if ($c.Length -gt 0 -and $c[0] -eq [char]0xFEFF) { $c = $c.Substring(1) }

    foreach ($pair in $pairs) {
        $c = $c.Replace($pair[0], [string]$pair[1])
    }

    [System.IO.File]::WriteAllText($file, $c, $utf8NoBom)
    Write-Host "Fixed: $file"
}
