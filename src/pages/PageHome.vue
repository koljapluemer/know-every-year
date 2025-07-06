<template>
    <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <!-- Hero Section -->
        <div class="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary text-primary-content">
            <div class="hero-content text-center">
                <div class="max-w-4xl">
                    <h1 class="text-5xl font-bold mb-8">Know Every Year</h1>
                    <p class="text-xl mb-8">
                        A little app to gradually memorize what happened in every year from 0 to 2025, 
                        using the <a href="https://artofmemory.com/blog/major-system/" class="link link-accent" target="_blank">Major System</a>
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link :to="{ name: 'Practice' }" class="btn btn-primary btn-lg">
                            Start Practicing
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Demo Image -->
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-center">
                <img src="/demo_crop.webp" alt="Know Every Year Demo" class="rounded-lg shadow-2xl max-w-full h-auto" />
            </div>
        </div>

        <!-- Goal Section -->
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12">Goal</h2>
                <div class="space-y-6">
                    <p class="text-lg">
                        - Somebody says "I think that was in 1723" and you go "ah right, the year where 
                        <a href="https://www.onthisday.com/date/1723" class="link link-primary" target="_blank">that English guy invented that gunpowder-powered fire extinguisher</a>"
                    </p>
                    <p class="text-lg">
                        - <em>Or, at least</em>, somebody says "In 1852..." and you go "OK, so some years after 
                        <a href="https://www.onthisday.com/date/1847" class="link link-secondary" target="_blank">Colt sold his revolver to the US government</a>"
                    </p>
                    <p class="text-lg">
                        - On the side, you'll learn how to use the 
                        <a href="https://artofmemory.com/blog/major-system/" class="link link-accent font-semibold" target="_blank">Major System</a> 
                        to memorize numbers
                    </p>
                </div>
            </div>
        </div>

        <!-- Problem Section -->
        <div class="bg-base-300 py-16">
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-3xl font-bold text-center mb-12">Problem</h2>
                    <p class="text-lg mb-8">
                        If you want to memorize world history through the Major System, you have to go on a pretty involved journey:
                    </p>
                    
                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <div class="badge badge-primary badge-lg">1</div>
                            <div>
                                <p class="text-lg">Get a grip on the number to sound conversion the system uses (ideally memorize that)</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="badge badge-secondary badge-lg">2</div>
                            <div>
                                <p class="text-lg">Design 100 pegs for two-digit numbers, using what you learned above (ideally memorize those)</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="badge badge-accent badge-lg">3</div>
                            <div>
                                <p class="text-lg">Start designing mnemonics for all 2025 years, using what you learned above — where do you even start, at year 0?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-8">
                        <p class="text-lg font-semibold">
                            This has so far demotivated me from actually starting this project, thus I built this app...
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- How it Works Section -->
        <div class="container mx-auto px-4 py-16">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12">How it Works</h2>
                
                <div class="alert alert-error mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>
                        You should be familiar with the ideas of the 
                        <a href="https://artofmemory.com/blog/major-system/" class="link" target="_blank">Major System</a> 
                        and what it tries to do, otherwise none of this will make very much sense.
                    </span>
                </div>

                <h3 class="text-2xl font-bold mb-8">Main Practice Queue</h3>
                <p class="text-lg mb-8">
                    <em>Know Every Year</em> presents you with a single interface, which smartly & gradually presents you with all the tasks you have to get done until you memorized all the years, starting at zero and never overwhelming you.
                </p>

                <p class="text-lg mb-8">
                    It uses spaced repetition flashcards (using the state of the art ts-fsrs) to familiarize you with the single digit pegs the system uses. You are challenged to associate sound with number, and number with sound(s):
                </p>

                <div class="grid lg:grid-cols-2 gap-8 mb-12">
                    <img src="/learn_digit.webp" alt="Learning digits" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                    <img src="/learn_sound.webp" alt="Learning sounds" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                </div>

                <p class="text-lg mb-8">
                    Then, gradually, it prompts you to invent mnemonics for digit pairs (00-99), using the pegs:
                </p>

                <div class="mb-12">
                    <img src="/add_nr_association.webp" alt="Adding number associations" class="rounded-lg shadow-lg max-w-full h-auto max-h-[500px] max-w-[700px]" />
                </div>

                <p class="text-lg mb-8">
                    These are also practiced with spaced repetition, in both directions:
                </p>

                <div class="grid lg:grid-cols-2 gap-8 mb-12">
                    <img src="/practice_nr.webp" alt="Practice by number" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                    <img src="/practice_word.webp" alt="Practice by word" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                </div>

                <p class="text-lg mb-8">
                    Then, once you start collecting some digit pair pegs, it prompts you to research and add events for given years:
                </p>

                <div class="mb-12">
                    <img src="/add_year.webp" alt="Adding year events" class="rounded-lg shadow-lg max-w-full h-auto max-h-[500px] max-w-[700px]" />
                </div>

                <div class="alert alert-info mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>
                        You can put whatever events you want in here. 
                        <a href="https://www.onthisday.com" class="link" target="_blank">On This Day</a> and Wikipedia are pretty good sources, 
                        but you could also focus on book or movie releases or anything, really.
                    </span>
                </div>

                <p class="text-lg mb-8">
                    And again, it will quiz you on those using spaced repetition:
                </p>

                <div class="grid lg:grid-cols-2 gap-8 mb-12">
                    <img src="/learn_by_event.webp" alt="Learn by event" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                    <img src="/learn_by_year.webp" alt="Learn by year" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                </div>
            </div>
        </div>

        <!-- Managing Section -->
        <div class="bg-base-300 py-16">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <h2 class="text-3xl font-bold text-center mb-12">Managing</h2>
                    
                    <p class="text-lg mb-8">
                        You can customize which digits should be associated with which sounds:
                    </p>

                    <div class="mb-12">
                        <img src="/manage_digits.webp" alt="Manage digit associations" class="rounded-lg shadow-lg max-w-full h-auto max-h-[500px] max-w-[700px]" />
                    </div>

                    <div class="alert alert-warning mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>
                            If you want to customize those pegs, do it early, otherwise you will create number pair associations with outdated pegs!
                        </span>
                    </div>

                    <p class="text-lg mb-8">
                        In the same way, you can also view your number associations and your years+events in a list and edit them directly:
                    </p>

                    <div class="grid lg:grid-cols-2 gap-8">
                        <img src="/manage_nrs.webp" alt="Manage number associations" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                        <img src="/manage_years.webp" alt="Manage years" class="rounded-lg shadow-lg max-w-full h-auto max-h-[400px] max-w-[500px]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
