// Keep real lyrics while hiding NetEase's instrumental placeholder.
(() => {
  const placeholder = /^(?:纯音乐[，,]?\s*请欣赏|此歌曲为没有填词的纯音乐[，,]?\s*请您欣赏)[。！!]?$/

  const updateLyrics = () => {
    document.querySelectorAll('.aplayer-lrc p').forEach(line => {
      const isPlaceholder = placeholder.test(line.textContent.trim())
      line.classList.toggle('music-placeholder-hidden', isPlaceholder)
      line.setAttribute('aria-hidden', String(isPlaceholder))
    })
  }

  const start = () => {
    updateLyrics()

    const observer = new MutationObserver(updateLyrics)
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
})()
