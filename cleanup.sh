#!/bin/bash

# SCSS klasöründeki CSS dosyalarını temizle
rm -f scss/style.css scss/style.css.map

# Geçici dosyaları temizle
rm -f .DS_Store */.DS_Store
rm -f setup-css.sh transfer-css.sh

# Node modüllerini temizle (gerekirse)
# rm -rf node_modules

echo "Gereksiz dosyalar temizlendi."

# VS Code Live Sass Compiler ayarlarını oluştur
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
    "liveSassCompile.settings.formats": [
        {
            "format": "compressed",
            "extensionName": ".css",
            "savePath": "/css"
        }
    ],
    "liveSassCompile.settings.generateMap": true,
    "liveSassCompile.settings.autoprefix": [
        "> 1%",
        "last 2 versions"
    ]
}
EOF

echo "VS Code Live Sass Compiler ayarları oluşturuldu."

# CSS dosyalarını optimize et
if command -v npx &> /dev/null; then
    if npx clean-css-cli --version &> /dev/null; then
        npx clean-css-cli css/style.css -o css/style.min.css
        echo "CSS dosyası optimize edildi: css/style.min.css"
    else
        echo "CSS optimizasyonu için: npm install clean-css-cli --save-dev"
    fi
else
    echo "NPX komutu bulunamadı. Node.js kurulumu kontrol edin."
fi

echo "Temizlik ve optimizasyon tamamlandı."
