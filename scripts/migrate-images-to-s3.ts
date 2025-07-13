import fs from 'fs';
import path from 'path';
import { uploadFileToS3 } from '../lib/s3';

async function migrateImagesToS3() {
  const publicDir = path.join(process.cwd(), 'public');
  const imageDirs = [
    'images/certificates',
    'images/placeholders/services',
    'images'
  ];

  console.log('Начинаем миграцию изображений в S3...');

  for (const dir of imageDirs) {
    const fullPath = path.join(publicDir, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Папка ${dir} не найдена, пропускаем...`);
      continue;
    }

    const files = fs.readdirSync(fullPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );

    console.log(`Найдено ${imageFiles.length} изображений в папке ${dir}`);

    for (const file of imageFiles) {
      try {
        const filePath = path.join(fullPath, file);
        const fileBuffer = fs.readFileSync(filePath);
        const stats = fs.statSync(filePath);
        
        // Определяем MIME тип
        const ext = path.extname(file).toLowerCase();
        let contentType = 'image/jpeg';
        
        switch (ext) {
          case '.png':
            contentType = 'image/png';
            break;
          case '.gif':
            contentType = 'image/gif';
            break;
          case '.webp':
            contentType = 'image/webp';
            break;
          case '.svg':
            contentType = 'image/svg+xml';
            break;
        }

        // Загружаем в S3
        const result = await uploadFileToS3(
          fileBuffer,
          contentType,
          dir.replace('images/', '').replace('images', 'legacy'), // Сохраняем структуру папок
          file
        );

        console.log(`✅ Загружен: ${file} -> ${result.publicUrl}`);
        
        // Создаем файл с маппингом для обновления ссылок
        const mappingFile = path.join(process.cwd(), 'image-mapping.json');
        let mapping = {};
        
        if (fs.existsSync(mappingFile)) {
          mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
        }
        
        const oldUrl = `/${dir}/${file}`;
        mapping[oldUrl] = result.publicUrl;
        
        fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
        
      } catch (error) {
        console.error(`❌ Ошибка при загрузке ${file}:`, error);
      }
    }
  }

  console.log('Миграция завершена!');
  console.log('Создан файл image-mapping.json с соответствием старых и новых URL');
}

// Запускаем миграцию, если скрипт вызван напрямую
if (require.main === module) {
  migrateImagesToS3().catch(console.error);
}

export default migrateImagesToS3; 