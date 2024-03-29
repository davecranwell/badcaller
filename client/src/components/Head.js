import { useEffect } from 'react'

function Head({ ringing, rating }) {
  useEffect(() => {
    document.title = `
    ${rating ? `${rating} | ` : ''}
    Badcaller
  `
    const favicon = document.getElementById('favicon')

    const ratingColors = {
      dangerous: 'c9323b',
      harrassing: 'e96034',
      negative: 'e96034',
      neutral: '666',
      safe: '4a9401',
    }

    const faviconColor = ratingColors[rating] || '000'

    favicon.href = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="#fff"/><path fill="#${faviconColor}" d="M59.9 27.6A30 30 0 10.1 32.5a30 30 0 0059.8-5zM48 43l-2.2 2.3a10.6 10.6 0 01-5 2.8 16 16 0 01-4 0c-3.2-.4-6.2-1.5-8.8-3.4a45.5 45.5 0 01-6.8-5.8l-1.5-1.6c-4.5-4.8-9.4-11.8-7.8-18a10 10 0 012.9-5L17 12a1.5 1.5 0 011.2-.4c.2 0 .4 0 .5.2l4.4 4.4a3.7 3.7 0 010 5.3l-.8.8A4 4 0 0021 25c0 .9.7 2.6.7 2.6 3 4.5 7 8.4 11.6 11.3a3.2 3.2 0 003.8-.4l1.3-1.4a3.7 3.7 0 015.3 0l4.4 4.5.2.4a1.5 1.5 0 01-.4 1.2z"/></svg>`
    )}`
  }, [ringing, rating])

  return null
}

export default Head
