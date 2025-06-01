// utils.js
const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];
// solid autocad gibi programların formatları eklenecek

const iconUrl = (icon) => `/assets/icons/files/${icon}.svg`;
export function fileFormat(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();

  if (FORMAT_TEXT.includes(extension)) {
    return 'txt';
  }
  if (FORMAT_ZIP.includes(extension)) {
    return 'zip';
  }
  if (FORMAT_AUDIO.includes(extension)) {
    return 'audio';
  }
  if (FORMAT_IMG.includes(extension)) {
    return 'image';
  }
  if (FORMAT_VIDEO.includes(extension)) {
    return 'video';
  }
  if (FORMAT_WORD.includes(extension)) {
    return 'word';
  }
  if (FORMAT_EXCEL.includes(extension)) {
    return 'excel';
  }
  if (FORMAT_POWERPOINT.includes(extension)) {
    return 'powerpoint';
  }
  if (FORMAT_PDF.includes(extension)) {
    return 'pdf';
  }
  if (FORMAT_PHOTOSHOP.includes(extension)) {
    return 'photoshop';
  }
  if (FORMAT_ILLUSTRATOR.includes(extension)) {
    return 'illustrator';
  }
  return extension;
}

export function fileThumb(fileUrl) {
  let thumb;

  switch (fileFormat(fileUrl)) {
    case 'folder':
      thumb = iconUrl('ic_folder');
      break;
    case 'txt':
      thumb = iconUrl('ic_txt');
      break;
    case 'zip':
      thumb = iconUrl('ic_zip');
      break;
    case 'audio':
      thumb = iconUrl('ic_audio');
      break;
    case 'video':
      thumb = iconUrl('ic_video');
      break;
    case 'word':
      thumb = iconUrl('ic_word');
      break;
    case 'excel':
      thumb = iconUrl('ic_excel');
      break;
    case 'powerpoint':
      thumb = iconUrl('ic_power_point');
      break;
    case 'pdf':
      thumb = iconUrl('ic_pdf');
      break;
    case 'photoshop':
      thumb = iconUrl('ic_pts');
      break;
    case 'illustrator':
      thumb = iconUrl('ic_ai');
      break;
    case 'image':
      thumb = iconUrl('ic_img');
      break;
    default:
      thumb = iconUrl('ic_file');
  }
  return thumb;
}
export function fileNameByUrl(file) {
  return file.filename || '';
}

export function fileTypeByUrl(file) {
  console.log('filecont', file);
  const contentType = file.contentType || '';
  const extensionIndex = contentType.lastIndexOf('/');
  if (extensionIndex !== -1) {
    return contentType.substring(extensionIndex + 1);
  }
  return '';
}

export function fileData(file) {
  if (!file) {
    return {};
  }

  if (typeof file === 'string') {
    return {
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
    };
  }

  return {
    preview: file.filename,
    name: file.filename,
    size: file.size,
    path: file.remarkId,
    type: file.contentType.split('/')[1],
    lastModified: file.uploadDate,
  };
}
