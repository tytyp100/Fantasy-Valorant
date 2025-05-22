'use server'

import { JSDOM } from 'jsdom'

/**
 * reference from https://github.com/axsddlr/vlrggapi/blob/master/api/scrapers/stats.py
 */


const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0',
}

export async function getVLRStats(region: string, timespan: string) {
  try {
    const base_url = `https://www.vlr.gg/stats/?event_group_id=all&event_id=all&region=${region}&country=all&min_rounds=200&min_rating=1550&agent=all&map_id=all`
    const url =
      timespan.toLowerCase() === 'all'
        ? `${base_url}&timespan=all`
        : `${base_url}&timespan=${timespan}d`

    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`API response: ${response.status}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    const result = []
    const rows = document.querySelectorAll('tbody tr')

    for (const row of rows) {
      const playerText =
        row.textContent
          ?.replace(/\t/g, '')
          .replace(/\n/g, ' ')
          .trim()
          .split(' ') || []
      const playerName = playerText[0]
      const org = playerText[1] || 'N/A'

      const agents = Array.from(row.querySelectorAll('td.mod-agents img')).map(
        (img) => {
          const src = (img as HTMLImageElement).src
          return src.split('/').pop()?.split('.')[0] || ''
        }
      )

      const colorSquares = Array.from(
        row.querySelectorAll('td.mod-color-sq')
      ).map((sq) => sq.textContent?.trim() || '')
      const rounds = row.querySelector('td.mod-rnd')?.textContent?.trim() || ''

      result.push({
        player: playerName,
        org: org,
        agents: agents,
        rounds_played: rounds,
        rating: colorSquares[0],
        average_combat_score: colorSquares[1],
        kill_deaths: colorSquares[2],
        kill_assists_survived_traded: colorSquares[3],
        average_damage_per_round: colorSquares[4],
        kills_per_round: colorSquares[5],
        assists_per_round: colorSquares[6],
        first_kills_per_round: colorSquares[7],
        first_deaths_per_round: colorSquares[8],
        headshot_percentage: colorSquares[9],
        clutch_success_percentage: colorSquares[10],
      })
    }

    return {
      data: {
        status: response.status,
        segments: result,
      },
    }
  } catch (error) {
    console.error('Error fetching VLR stats:', error)
    throw error
  }
}