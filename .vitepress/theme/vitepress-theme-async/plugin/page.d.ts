import { UserConfig } from 'vitepress';

type DynamicPages = {
    params: {
        [x: string]: string;
    };
};
/**
 * 动态路由生成
 * @param config 主题配置信息
 * @param pageType 页面 layout 类型
 * @param root 根目录
 * @returns
 */
declare const dynamicPages: (config: UserConfig<AsyncThemeConfig>, pageType: AsyncTheme.PageType, root?: string) => Promise<DynamicPages[]>;

export { dynamicPages };
