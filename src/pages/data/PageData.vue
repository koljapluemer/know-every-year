<script setup lang="ts">
import { Check, Edit, Square, SquareCheckBig, Trash, X } from 'lucide-vue-next';

</script>

<template>
    <section>
        <h2>Per Digit Mnemonics</h2>
        <div class="grid grid-cols-[auto_auto_1fr] gap-2 items-center">
            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">0</div>
            <div>s/z/soft c</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">1</div>
            <div>t/d</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">2</div>
            <div>n</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">3</div>
            <div>m</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">4</div>
            <div>r</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">5</div>
            <div>l</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">6</div>
            <div>sh/soft ch/j/soft g/zh</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">7</div>
            <div>k/hard c/hard g/hard ch/q/qu</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">8</div>
            <div class="flex flex-row gap-2">

                <input type="text" placeholder="Edit Number-Letter Connection" class="min-w-2xl" value="f/v" />
                <button class="btn">
                    <X :size="12" />
                </button>
                <button class="btn">
                    <Check :size="12" />
                </button>
            </div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">9</div>
            <div>p/b</div>
        </div>
    </section>
    <section>
        <h2>Two-Digit Word Hooks</h2>
        <div class="grid grid-cols-[auto_auto_1fr] gap-2 items-center">
            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">00</div>
            <div>sass</div>

            <div>
                <button class="btn">
                    <Edit :size="12" />
                </button>
            </div>
            <div class="font-bold">01</div>
            <div>sad</div>
        </div>
    </section>
    <section>
        <h2>Custom Number Word Hooks</h2>
        <div class="grid grid-cols-[auto_auto_1fr] gap-2 items-center">
            <div class="flex flex-row gap-2">
                <button class="btn">
                    <Edit :size="12" />
                </button>
                <button class="btn">
                    <Trash :size="12" />
                </button>
            </div>
            <div class="font-bold">9999</div>
            <div>propeller</div>

            <div class="flex flex-row gap-2">
                <button class="btn">
                    <Edit :size="12" />
                </button>
                <button class="btn">
                    <Trash :size="12" />
                </button>
            </div>
            <div class="font-bold">-</div>
            <div>object on fire</div>
        </div>
    </section>
    <section>
        <h2>To-Dos</h2>
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
                <button class="btn">
                    <Square :size="12" />
                </button>
                <button class="btn">
                    <Edit :size="12" />
                </button>
                <button class="btn">
                    <Trash :size="12" />
                </button>
                <div class="">Ancient Rome History Core Dates</div>
            </div>

            <div class="flex flex-row gap-2">
                <button class="btn">
                    <SquareCheckBig :size="12" />
                </button>
                <button class="btn">
                    <Edit :size="12" />
                </button>
                <button class="btn">
                    <Trash :size="12" />
                </button>
                <div>Female Inventors</div>
            </div>

            <div class="flex flex-row gap-2">
                <button class="btn">
                    <SquareCheckBig :size="12" />
                </button>
                <button class="btn">
                    <Edit :size="12" />
                </button>
                <button class="btn">
                    <Trash :size="12" />
                </button>
                <div>Friend's Birthdays</div>
            </div>
        </div>
    </section>
    <section>
        <h2>To Memorize</h2>
    </section>
</template>