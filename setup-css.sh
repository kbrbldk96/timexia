#!/bin/bash

# CSS klasörünü oluştur
mkdir -p css

# package.json dosyasını kontrol et ve yoksa oluştur
if [ ! -f package.json ]; then
  echo "{
  \"name\": \"timexia\",
  \"version\": \"1.0.0\",
  \"description\": \"Timexia randevu sistemi\",
  \"scripts\": {
    \"css-compile\": \"sass --style=compressed --source-map scss/style.scss:css/style.css\",
    \"css-watch\": \"sass --watch --style=compressed --source-map scss/style.scss:css/style.css\",
    \"start\": \"npm run css-watch\"
  },
  \"author\": \"\",
  \"license\": \"ISC\",
  \"devDependencies\": {
    \"sass\": \"^1.69.0\"
  }
}" > package.json
  echo "package.json dosyası oluşturuldu"
fi

# Geçici style.css dosyası oluştur (npm kurulumu öncesi)
echo "/* Geçici stil dosyası */" > css/style.css
echo "body { font-family: 'Inter', sans-serif; }" >> css/style.css
echo "Geçici CSS dosyası oluşturuldu"

# Komut satırı bilgisi
echo ""
echo "Kurulum tamamlandı. Şunları yapmalısınız:"
echo "1. Terminal'de projenin bulunduğu dizine gidin: cd /Users/kubrabulduk/Kimly/Project/timexia/"
echo "2. npm paketlerini yükleyin: npm install"
echo "3. SCSS'i CSS'e derleyin: npm run css-compile"
echo "4. Geliştirme sırasında otomatik derleme için: npm run css-watch"
echo ""
