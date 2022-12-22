# Kicker Tracker

A fun little game tracker I built for tracking kicker games during my time at [claimsforce](https://claimsforce.com/).

**Domain**: Initially [thanks-for-playing.com](https://thanks-for-playing.com/), now [kicker-claimsforce.vercel.app](https://kicker-claimsforce.vercel.app/).

## How it works

The games are rated using the [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system).
<details><summary>How does the Elo rating work?</summary>
<p>

> The basic idea behind the Elo system is that each player has a rating, which is a number that represents their skill level. When two players compete, the winner's rating goes up and the loser's rating goes down. The amount by which the ratings change depends on the difference between the players' ratings and the outcome of the game.
> 
> Here's how it works:
> 
> 1. Each player starts with a certain rating, in this game 1500.
> 2. When two players compete, a mathematical formula is used to calculate the expected score for each player, based on their ratings.
> 3. If a player's actual score is higher than their expected score, their rating goes up. If it is lower, their rating goes down.
> 4. The amount by which a player's rating changes depends on the difference between their actual score and their expected score, as well as the weight of the tournament or match.

_generated with [ChatGPT](https://chat.openai.com/chat)_

</p>

</details>

<details><summary>Screenshots</summary>
<p>

![Screenshot 2022-12-22 at 12 11 28](https://user-images.githubusercontent.com/19997520/209122294-7930c9b9-58f0-4e41-aaca-861e1b4a18c9.jpg)
![Screenshot 2022-12-22 at 12 12 05](https://user-images.githubusercontent.com/19997520/209122306-3e910b6d-badd-441f-8f69-b12114fb6af0.jpg)

</p>
</details>

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [React + Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/) (hosting)
- [Redis with Upstash](https://upstash.com/redis) (database)

## Contributing

Check the [CONTRIBUTING.md](https://github.com/JonathanWbn/kicker-tracker/blob/master/CONTRIBUTING.md).
