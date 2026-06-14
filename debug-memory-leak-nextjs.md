# Debug Session: memory-leak-nextjs

## Session Info
- **Session ID**: memory-leak-nextjs
- **Created**: 2026-06-14
- **Status**: [OPEN]

## Problem Statement
Next.js 应用运行一段时间后出现内存溢出 (JavaScript heap out of memory)
- 内存从约7874MB持续增长到7896MB
- GC无法有效回收内存
- 运行约34分钟后崩溃

## Environment
- Next.js 16.2.6 (Turbopack)
- Node.js
- Windows

## Hypotheses
1. **事件监听器泄漏** - 音频元素的事件监听器未正确清理
2. **定时器泄漏** - setInterval/setTimeout 未在组件卸载时清理
3. **状态累积** - React状态在频繁更新时未正确释放
4. **图片/资源泄漏** - 封面图片URL每次渲染都生成新请求

## Investigation Plan
1. [x] 检查 music/page.tsx 中的所有 useEffect
2. [x] 检查事件监听器的清理函数
3. [x] 检查定时器的清理
4. [x] 重构音频逻辑避免闭包问题

## Root Cause Identified
1. **事件监听器累积**: selectTrack 函数中每次点击都会添加新的 canplaythrough 监听器
2. **闭包陷阱**: handleEnded 中引用的 handleNext 依赖旧的状态值
3. **useEffect 依赖问题**: 多个 useEffect 相互依赖导致内存泄漏

## Fixes Applied
1. [x] 移除 selectTrack 中的 canplaythrough 监听器
2. [x] 使用 useRef 存储最新状态避免闭包问题
3. [x] 简化音频事件监听器，只在组件挂载时添加一次
4. [x] 移除 handlePrev/handleNext 中的冗余 setIsPlaying

## Status History
- 2026-06-14: Session created
- 2026-06-14: Root cause identified and fixes applied
- 2026-06-14: Pending user verification
