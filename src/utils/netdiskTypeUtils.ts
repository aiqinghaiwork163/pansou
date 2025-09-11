/**
 * 获取网盘类型对应的英文ID
 * @param typeName 网盘类型名称
 * @returns 英文ID
 */
export function getNetdiskTypeId(typeName: string): string {
  const typeIdMap: { [key: string]: string } = {
    '夸克网盘': 'quark',
    '百度网盘': 'baidu',
    '阿里云盘': 'aliyun',
    '天翼云盘': 'tianyi',
    'UC网盘': 'uc',
    '迅雷网盘': 'xunlei',
    '蓝奏云': 'lanzou',
    '115网盘': '115',
    '微云': 'weiyun',
    '坚果云': 'jianguoyun',
    'PikPak': 'pikpak',
    '123云盘': '123',
    '移动云盘': 'mobile',
    
    // 磁力和下载链接
    '磁力链接': 'magnet',
    '电驴': 'ed2k',
    '迅雷链接': 'thunder',
    'FTP链接': 'ftp',
    '种子文件': 'torrent',
    
    // 影视资源
    '4K狐狸': 'fox4k',
    '低端影视': 'ddys',
    '茉莉HD': 'hdmoli',
    'JavDB': 'javdb',
    '雨花阁': 'yuhuage',
    'U3C3': 'u3c3',
    
    // 聚合资源
    '聚合资源': 'merged',
  };
  
  return typeIdMap[typeName] || typeName.toLowerCase().replace(/[\u4e00-\u9fff\s]/g, '') || 'unknown';
}