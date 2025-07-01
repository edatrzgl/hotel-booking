
# Otel Rezervasyon
Bu proje, otel arama, rezervasyon yapma, yorum görüntüleme ve AI tabanlı basit bir konuşma özelliği sağlayan bir web uygulamasıdır. Backend MSSQL, MongoDB, RabbitMQ ve Docker kullanılarak geliştirildi; frontend ise React ile oluşturuldu.


# API’lar





Oda ekleme (POST, JWT gerekli)



Otel arama (GET)



Rezervasyon yapma (POST)



Yorumları listeleme (GET)

# Sistem Mimarisi

# Backend





MSSQL: Rezervasyonlar için ilişkisel veritabanı kullanıldı. Azure Data Studio ile rezervasyon ve otel verileri kontrol edildi.



MongoDB: Yorumlar için NoSQL veritabanı kullanıldı. MongoDB Compass ile yorum verileri kontrol edildi.



Docker: API, MSSQL, MongoDB ve RabbitMQ servisleri Docker konteynerlerinde çalıştırıldı. Tüm bileşenlerin çalıştığı doğrulandı.
![Ekran görüntüsü 2025-07-01 173752](https://github.com/user-attachments/assets/50664851-7c2f-446f-9939-3d3266a9fce0)

![Ekran görüntüsü 2025-07-01 170056](https://github.com/user-attachments/assets/948ad7b3-53a8-408f-a88e-44f50195c3bf)

![Ekran görüntüsü 2025-07-01 164527](https://github.com/user-attachments/assets/a2fd03ec-e56d-404b-9975-a5db99b789b4)

RabbitMQ: Rezervasyon kuyrukları için kullanıldı. Yönetim paneli yerel sunucuda kontrol edildi.

# Frontend
React ile geliştirildi ve http-server ile 127.0.0.1:8080 adresinde çalıştırıldı. Bağımlılıklar olarak React, ReactDOM, Axios, Chart.js ve Tailwind CSS kullanıldı.

# Hata Raporu

Sorun Tanımı

Frontend:
127.0.0.1:8080 adresinde beyaz ekran alındı. Tarayıcı konsolunda şu hatalar görüldü:





app.js’de beklenmeyen bir hata: JavaScript yerine HTML kodu çalıştırılmaya çalışılıyor.



Axios kaynak haritası eksik (işlevselliği etkilemiyor).



favicon.ico ve Chrome DevTools ile ilgili 404 hataları (işlevselliği etkilemiyor).

Backend:





Otel arama testi yapıldığında “Request failed with status code 404” hatası alındı. API çalışıyor, ancak veri bulunamadı.



Ana endpoint testi yapıldığında “cannot GET” hatası alındı. Ana endpoint tanımlı değil.

# Yapılan Çalışmalar

Backend:





MSSQL’de otel ve rezervasyon verileri kontrol edildi, veri olduğu doğrulandı. Gerektiğinde örnek veriler eklendi.



MongoDB’de yorum verileri kontrol edildi, gerektiğinde örnek veriler eklendi.



Docker ile API, MSSQL, MongoDB ve RabbitMQ servisleri başlatıldı. Tüm bileşenlerin çalıştığı kontrol edildi.



RabbitMQ’nun kuyruk yönetimi paneli yerel sunucuda kontrol edildi.



API testleri yapıldı, ancak otel arama testi 404, ana endpoint testi “cannot GET” hatası verdi. Farklı endpoint’ler de test edildi, benzer hatalar alındı.

Frontend:





React ile otel arama, rezervasyon, yorum grafiği ve AI konuşma özellikleri geliştirildi.



Beyaz ekran için:





Basit bir test sayfası çalıştı, “Merhaba, React çalışıyor!” yazısı göründü.



app.js’de farklı yaklaşımlar denendi, ancak beyaz ekran devam etti.



Tarayıcı önbelleği temizlendi, http-server önbelleksiz başlatıldı.



Bağımlılıklar kontrol edildi, hepsi doğru yüklendi ve tarayıcıda JavaScript olarak doğrulandı.



favicon.ico ve Chrome DevTools dosyaları oluşturuldu.



API entegrasyonu test edildi, ancak 404 hatası alındı ve beyaz ekran sorunu devam etti.

# Olası Nedenler

Frontend:





app.js’de JavaScript yerine HTML kodu çalıştırılmaya çalışılıyor, bu da React veya ReactDOM’un runtime’da tanımsız olmasına işaret edebilir.



Bağımlılıklar arasında çakışma veya yükleme sırası sorunu olabilir.

Backend:









Otel arama endpoint’i yanlış yapılandırılmış veya backend kodunda hata var.



Ana endpoint’in tanımlı olmaması, API’nin sınırlı endpoint’lerle çalıştığını gösteriyor.

# Son Durum

Backend çalışıyor, ancak otel arama testi veri bulamıyor, ana endpoint tanımlı değil. Frontend’de beyaz ekran sorunu çözülemedi, basit test sayfası çalışıyor ama uygulama çalışmıyor.
