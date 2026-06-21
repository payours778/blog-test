export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        欢迎来到管理后台
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            说说管理
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            管理您的动态说说，支持发布、编辑和删除
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            文章管理
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            管理您的博客文章，支持创建、编辑和删除
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-3xl mb-3">🖼️</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            照片管理
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            管理您的相册照片（开发中）
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-3xl mb-3">🎵</div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
            音乐管理
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            管理您的音乐列表（开发中）
          </p>
        </div>
      </div>
    </div>
  );
}