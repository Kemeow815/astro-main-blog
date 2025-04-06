
import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
// 明确指定导入的类型
import tseslint from '@typescript-eslint/utils'


export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  // Ignore files
  {
    ignores: ['public/scripts/*', 'scripts/*', '.astro/', 'src/env.d.ts']
  }
]
