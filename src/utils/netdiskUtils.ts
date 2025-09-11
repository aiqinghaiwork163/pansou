/**
 * 根据URL自动识别网盘类型
 * @param url 网盘链接
 * @param source 原始来源标识
 * @returns 友好的网盘名称
 */
export function getNetdiskTypeFromUrl(url: string, source?: string): string {
  // 检查URL是否为空或无效（例如"空"或"无"或包含占位符文本）
  if (!url || url.trim() === '' || /^(无|空|null|undefined|n\/a)$/i.test(url) || 
      url.includes('placeholder') || url.includes('example.com')) {
    return '未知网盘';
  }
  
  // 转换为小写以便匹配
  const urlLower = url.toLowerCase();
  
  // 根据URL域名识别网盘类型
  const urlPatterns = [
    // 主流网盘
    { patterns: ['pan.quark.cn', 'quark.cn'], name: '夸克网盘' },
    { patterns: ['pan.baidu.com', 'yun.baidu.com'], name: '百度网盘' },
    { patterns: ['www.alipan.com', 'aliyundrive.com', 'drive.aliyun.com', 'alipan.com'], name: '阿里云盘' },
    { patterns: ['cloud.189.cn', 'tianyi.189.cn'], name: '天翼云盘' },
    { patterns: ['drive.uc.cn'], name: 'UC网盘' },
    { patterns: ['pan.xunlei.com'], name: '迅雷网盘' },
    { patterns: ['www.lanzou.com', 'lanzous.com', 'lanzoux.com'], name: '蓝奏云' },
    // 优化115网盘的识别逻辑，添加更多域名
    { patterns: ['115.com', '115cdn.com', 'anxia.com', '115img.com'], name: '115网盘' },
    { patterns: ['share.weiyun.com'], name: '微云' },
    { patterns: ['www.jianguoyun.com'], name: '坚果云' },
    { patterns: ['mypikpak.com', 'pikpak.com'], name: 'PikPak' },
    { patterns: ['caiyun.139.com'], name: '移动云盘' },
    
    // 123云盘优化识别
    { patterns: ['123pan.com', '123yunpan.com'], name: '123云盘' },
    
    // 磁力链接和其他
    { patterns: ['magnet:', 'magnet:?xt='], name: '磁力链接' },
    { patterns: ['ed2k://'], name: '电驴' },
    { patterns: ['thunder://'], name: '迅雷链接' },
    { patterns: ['ftp://'], name: 'FTP链接' },
    { patterns: ['.torrent'], name: '种子文件' },
    
    // 影视资源站
    { patterns: ['www.4kfox.com', '4kfox.com'], name: '4K狐狸' },
    { patterns: ['ddys.tv', 'ddys.art'], name: '低端影视' },
    { patterns: ['www.hdmoli.com'], name: '茉莉HD' },
    { patterns: ['javdb.com'], name: 'JavDB' },
    { patterns: ['yuhuage.org'], name: '雨花阁' },
    { patterns: ['u3c3.com', 'u3c3u3c3.u3c3u3c3u3c3.com'], name: 'U3C3' },
  ];
  
  // 匹配URL模式
  for (const { patterns, name } of urlPatterns) {
    if (patterns.some(pattern => urlLower.includes(pattern))) {
      return name;
    }
  }
  
  // 特殊匹配：123云盘（所有以https://123开头的链接或包含www.123的域名）
  if (urlLower.startsWith('https://123') || urlLower.includes('www.123')) {
    return '123云盘';
  }
  
  // 如果URL不匹配，尝试从source转换
  if (source) {
    const sourcePatterns = [
      // 插件名称到网盘名称的映射
      { patterns: ['quark', 'xys'], name: '夸克网盘' },
      { patterns: ['baidu'], name: '百度网盘' },
      { patterns: ['aliyun', 'alipan'], name: '阿里云盘' },
      { patterns: ['tianyi'], name: '天翼云盘' },
      { patterns: ['uc'], name: 'UC网盘' },
      { patterns: ['xunlei'], name: '迅雷网盘' },
      { patterns: ['lanzou'], name: '蓝奏云' },
      // 优化115网盘的识别逻辑
      { patterns: ['115'], name: '115网盘' },
      { patterns: ['weiyun'], name: '微云' },
      { patterns: ['jianguoyun'], name: '坚果云' },
      { patterns: ['pikpak'], name: 'PikPak' },
      { patterns: ['123'], name: '123云盘' },
      { patterns: ['mobile', 'caiyun'], name: '移动云盘' },
      
      // 磁力和其他
      { patterns: ['fox4k'], name: '4K狐狸' },
      { patterns: ['magnet', 'thunder'], name: '磁力链接' },
      { patterns: ['torrent', 'bt'], name: '种子文件' },
      { patterns: ['ddys'], name: '低端影视' },
      { patterns: ['hdmoli'], name: '茉莉HD' },
      { patterns: ['javdb'], name: 'JavDB' },
      { patterns: ['yuhuage'], name: '雨花阁' },
      { patterns: ['u3c3'], name: 'U3C3' },
      
      // 其他插件 - 隐藏或替换没有真实链接意义的类型
      { patterns: ['hunhepan'], name: '聚合资源' },
      { patterns: ['jikepan'], name: '聚合资源' },
      { patterns: ['panwiki'], name: '聚合资源' },
      { patterns: ['pansearch'], name: '聚合资源' },
    ];
    
    for (const { patterns, name } of sourcePatterns) {
      const sourceLower = source.toLowerCase().replace('plugin:', '');
      if (patterns.some(pattern => sourceLower.includes(pattern))) {
        return name;
      }
    }
  }
  
  // 如果包含plugin前缀，统一显示为聚合资源
  if (source && source.toLowerCase().includes('plugin')) {
    return '聚合资源';
  }
  
  // 如果都不匹配，返回清理后的source或默认值
  return source ? source.replace('plugin:', '').toUpperCase() : '未知网盘';
}

/**
 * 获取网盘类型对应的图标
 * @param netdiskType 网盘类型名称
 * @returns Font Awesome图标类名
 */
export function getNetdiskIcon(netdiskType: string): string {
  const iconMap: { [key: string]: string } = {
    '夸克网盘': 'fa-solid fa-bolt',
    '百度网盘': 'fa-solid fa-paw', 
    '阿里云盘': 'fa-solid fa-cloud',
    '天翼云盘': 'fa-solid fa-satellite-dish',
    'UC网盘': 'fa-solid fa-mobile-alt',
    '迅雷网盘': 'fa-solid fa-download',
    '蓝奏云': 'fa-solid fa-cloud-download-alt',
    '115网盘': 'fa-solid fa-hdd',
    '微云': 'fa-solid fa-cloud-rain',
    '坚果云': 'fa-solid fa-seedling',
    'PikPak': 'fa-solid fa-box',
    '123云盘': 'fa-solid fa-archive',
    '移动云盘': 'fa-solid fa-mobile',
    
    // 磁力和下载链接
    '磁力链接': 'fa-solid fa-magnet',
    '电驴': 'fa-solid fa-link',
    '迅雷链接': 'fa-solid fa-bolt',
    'FTP链接': 'fa-solid fa-server',
    '种子文件': 'fa-solid fa-seedling',
    
    // 影视资源
    '4K狐狸': 'fa-solid fa-film',
    '低端影视': 'fa-solid fa-video',
    '茉莉HD': 'fa-solid fa-play-circle',
    'JavDB': 'fa-solid fa-database',
    '雨花阁': 'fa-solid fa-book',
    'U3C3': 'fa-solid fa-cube',
    
    // 聚合资源
    '聚合资源': 'fa-solid fa-layer-group',
  };
  
  return iconMap[netdiskType] || 'fa-solid fa-cloud';
}

/**
 * 获取网盘类型对应的颜色主题
 * @param netdiskType 网盘类型名称
 * @returns Tailwind CSS颜色类名
 */
export function getNetdiskColor(netdiskType: string): { bg: string; border: string; text: string } {
  const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
    '夸克网盘': { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-300' },
    '百度网盘': { bg: 'bg-red-500/20', border: 'border-red-400/30', text: 'text-red-300' },
    '阿里云盘': { bg: 'bg-orange-500/20', border: 'border-orange-400/30', text: 'text-orange-300' },
    '天翼云盘': { bg: 'bg-cyan-500/20', border: 'border-cyan-400/30', text: 'text-cyan-300' },
    'UC网盘': { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-300' },
    '迅雷网盘': { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-300' },
    '蓝奏云': { bg: 'bg-indigo-500/20', border: 'border-indigo-400/30', text: 'text-indigo-300' },
    '115网盘': { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-300' },
    '微云': { bg: 'bg-teal-500/20', border: 'border-teal-400/30', text: 'text-teal-300' },
    '坚果云': { bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', text: 'text-emerald-300' },
    'PikPak': { bg: 'bg-pink-500/20', border: 'border-pink-400/30', text: 'text-pink-300' },
    '123云盘': { bg: 'bg-lime-500/20', border: 'border-lime-400/30', text: 'text-lime-300' },
    '移动云盘': { bg: 'bg-sky-500/20', border: 'border-sky-400/30', text: 'text-sky-300' },
    
    // 磁力链接和下载
    '磁力链接': { bg: 'bg-red-600/20', border: 'border-red-500/30', text: 'text-red-400' },
    '电驴': { bg: 'bg-amber-500/20', border: 'border-amber-400/30', text: 'text-amber-300' },
    '迅雷链接': { bg: 'bg-violet-500/20', border: 'border-violet-400/30', text: 'text-violet-300' },
    'FTP链接': { bg: 'bg-slate-500/20', border: 'border-slate-400/30', text: 'text-slate-300' },
    '种子文件': { bg: 'bg-green-600/20', border: 'border-green-500/30', text: 'text-green-400' },
    
    // 影视资源
    '4K狐狸': { bg: 'bg-orange-600/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    '低端影视': { bg: 'bg-gray-500/20', border: 'border-gray-400/30', text: 'text-gray-300' },
    '茉莉HD': { bg: 'bg-rose-500/20', border: 'border-rose-400/30', text: 'text-rose-300' },
    'JavDB': { bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    '雨花阁': { bg: 'bg-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    'U3C3': { bg: 'bg-green-600/20', border: 'border-green-500/30', text: 'text-green-400' },
    
    // 聚合资源
    '聚合资源': { bg: 'bg-gray-500/20', border: 'border-gray-400/30', text: 'text-gray-300' },
  };
  
  return colorMap[netdiskType] || { bg: 'bg-gray-500/20', border: 'border-gray-400/30', text: 'text-gray-300' };
}