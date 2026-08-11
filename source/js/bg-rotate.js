// Hourly background rotation for homepage
// Put your favorite images in /source/images/bg/ folder
// The script picks one based on current hour, changes every hour
(() => {
  const backgrounds = [
    '/images/bg/liz-wallpaper.png',
    '/images/bg/53d8b2231dff1a42c97ff50d763c4f1f.png'
  ]

  const header = document.getElementById('page-header')
  if (!header || !header.classList.contains('full_page')) return

  if (backgrounds.length === 0) return

  // Pick background based on current hour (0-23)
  const currentHour = new Date().getHours()
  const index = currentHour % backgrounds.length

  header.style.backgroundImage = `url(${backgrounds[index]})`
})()
