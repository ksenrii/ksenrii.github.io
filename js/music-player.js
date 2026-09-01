// Build APlayer directly and replace Meting's broken audio proxy URLs.
(() => {
  const placeholder = /^(?:纯音乐[，,]?\s*请欣赏|此歌曲为没有填词的纯音乐[，,]?\s*请您欣赏)[。！!]?$/

  const getNetEaseSongId = rawUrl => {
    try {
      const url = new URL(rawUrl)
      if (url.searchParams.get('server') !== 'netease') return null
      if (url.searchParams.get('type') !== 'url') return null
      return url.searchParams.get('id')
    } catch (_) {
      return null
    }
  }

  const usePlayableUrl = track => {
    const songId = getNetEaseSongId(track.url)
    if (!songId) return track

    return {
      ...track,
      url: `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(songId)}.mp3`
    }
  }

  const updateLyrics = () => {
    document.querySelectorAll('.aplayer-lrc p').forEach(line => {
      const isPlaceholder = placeholder.test(line.textContent.trim())
      line.classList.toggle('music-placeholder-hidden', isPlaceholder)
      line.setAttribute('aria-hidden', String(isPlaceholder))
    })
  }

  const start = async () => {
    updateLyrics()

    const observer = new MutationObserver(updateLyrics)
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    })

    const container = document.getElementById('global-music-player')
    if (!container || !window.APlayer || container.dataset.initialized === 'true') return

    container.dataset.initialized = 'true'

    const api = new URL('https://api.i-meto.com/meting/api')
    api.searchParams.set('server', container.dataset.server || 'netease')
    api.searchParams.set('type', container.dataset.type || 'playlist')
    api.searchParams.set('id', container.dataset.id)
    api.searchParams.set('r', String(Math.random()))

    try {
      const response = await fetch(api, { credentials: 'omit' })
      if (!response.ok) throw new Error(`Playlist request failed: ${response.status}`)

      const tracks = await response.json()
      if (!Array.isArray(tracks) || tracks.length === 0) {
        throw new Error('The playlist contains no tracks')
      }

      window.blogMusicPlayer = new window.APlayer({
        container,
        audio: tracks.map(usePlayableUrl),
        fixed: true,
        mini: true,
        autoplay: false,
        loop: 'all',
        order: 'random',
        preload: 'metadata',
        volume: 0.5,
        mutex: true,
        listFolded: true,
        listMaxHeight: '340px',
        storageName: 'ksenr-blog-player',
        lrcType: 3
      })
    } catch (error) {
      container.dataset.initialized = 'false'
      console.error('[blog music player]', error)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }
})()
