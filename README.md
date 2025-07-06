# Know Every Year

![demo combined screenshot](publicdemo_crop.webp)

A little app to gradually memorize what happened in every year from 0 to 2025, using the [Major System](https://artofmemory.com/blog/major-system/)

## Start Practicing on [years.koljapluemer.com](years.koljapluemer.com)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S81CWUVD)

## Goal

- Somebody says "I think that was in 1723" and you go "ah right, the year where [that English guy invented that gunpowder-powered fire extinguisher](https://www.onthisday.com/date/1723)"
- *Or, at least*, somebody says "In 1852..." and you go "OK, so some years after [Colt solt his revolver to the US government](https://www.onthisday.com/date/1847)"
- On the side, you'll learn how to use the [Major System](https://artofmemory.com/blog/major-system/) to memorize numbers

## Problem

If you want to memorize world history through the Major System, you have to go on a pretty involved journey:

1. Get a grip on the number to sound conversion the system uses (ideally memorize that)
2. Design 100 pegs for two-digit numbers, using what you learned above (ideally memorize those)
3. Start designing mnemonics for all 2025 years, using what you learned above — where do you even start, at year 0?

This has so far demotivated me from actually starting this project, thus I built this app

## How it Works

> [!WARNING]
> You should be familar with the ideas of the [Major System](https://artofmemory.com/blog/major-system/) and what it tries to do, otherwise none of this will make very much sense.


### Main Practice Queue

*Know Every Year* presents you with a single interface, which smartly & gradually presents you with all the tasks you have to get done until you memorized all the years, starting at zero and never overwhelming you.

It uses spaced repetition flashcards (using the state of the art [ts-fsrs](github.com/open-spaced-repetition/ts-fsrs)) to familiarize you with the single digit pegs the system uses. You are challenged to associate sound with number, and number with sound(s):

![screenshot](publiclearn_digit.webp) ![screenshot](publiclearn_sound.webp)

Then, gradually, it prompts you to invent mnemonics for digit pairs (00-99), using the pegs:

![screenshot](publicadd_nr_association.webp) 

These are also practiced with spaced repetition, in both directions: 

![screenshot](publicpractice_nr.webp) ![screenshot](publicpractice_word.webp)

Then, once you start collecting some digit pair pegs, it prompts you to research and add events for given years:

![screenshot](publicadd_year.webp)

> [!TIP]
> You can put whatever events you want in here. [On This Day](https://www.onthisday.com) and Wikipedia are pretty good sources, but you could also focus on book or movie releases or anything, really.

And again, it will quiz you on those using spaced repetition:

![screenshot](publiclearn_by_event.webp) ![screenshot](publiclearn_by_year.webp)

### Managing

You can customize which digits should be associated with which sounds: 

![screenshot](publicmanage_digits.webp)

> [!WARNING]
> If you want customize those pegs, do it early, otherwise you will create number pair associations with outdated pegs!

In the same way, you can also view your number associations and your years+events in a list and edit them directly:

![screenshot](publicmanage_nrs.webp) ![screenshot](publicmanage_years.webp)