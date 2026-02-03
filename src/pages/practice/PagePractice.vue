<template>
    <section>
        <span class="tiny-label">Work on To-Do</span>
        <h2>Add Essential Dates of Classical Music History</h2>
        <div class="flex flex-col gap-8 mt-12 items-start">
            <div class="flex flex-col gap-4 items-start">
                <div class=" flex flex-row gap-2">
                    <button>
                        <ChevronUp :size="12" />
                    </button>
                    <button>
                        <Trash :size="12" />
                    </button>
                    <h3>1770</h3>
                </div>
                <div class=" flex flex-row gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <button class="">
                            <Trash :size="12" />
                        </button>
                        <button class="">
                            <Edit :size="12" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2 justify-center">
                        <h4>Beethoven born</h4>
                        <em>A TICK KISSing him as soon as he sees the light of day</em>
                    </div>
                </div>
                <div class=" flex flex-row gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <button class="">
                            <Trash :size="12" />
                        </button>
                        <button class="">
                            <Edit :size="12" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2 justify-center">
                        <h4>Giuseppe Tartini (violinist) dies</h4>
                        <em>A TICK tartly giving him the KISS of death</em>
                    </div>
                </div>
                <button>Add Event</button>
            </div>

            <div class="flex flex-col gap-4 items-start">

                <h3>1827</h3>

                <div class=" flex flex-row gap-2">
                    <div class="flex flex-col gap-2 justify-center">
                        <button class="">
                            <Trash :size="12" />
                        </button>
                        <button class="">
                            <Edit :size="12" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2 justify-center">

                        <h4>Beethoven dies</h4>
                        <em>no mnemonic.</em>
                    </div>
                </div>
                <button>Add Event</button>
            </div>

            <div class="flex flex-col gap-4 items-start">

                <h3>1943</h3>
                <div class="flex flex-row gap-1 items-center">
                    <span>19</span>
                    <ArrowRight :size="12" />
                    <div class="flex flex-row gap-2">
                        <input type="text" class="min-w-xl" placeholder="Enter Number Mnemonic t/d + p/b"/>
                        <button>
                            <X :size="12" />
                        </button>
                        <button>
                            <Check :size="12" />
                        </button>
                    </div>
                </div>
                <div class="flex flex-row gap-1 items-center">
                    <span>43</span>
                    <ArrowRight :size="12" />
                    <span>ROOM</span>
                </div>
                <div class=" flex flex-col gap-2">
                        <input type="text" placeholder="Enter Event" class="min-w-2xl" />
                        <input type="text" placeholder="Enter Mnemonic" class="min-w-2xl" />
                    <div class="flex gap-2">
                        <button>Cancel</button>
                        <button class="">Save</button>
                    </div>
                </div>
            </div>

            <button>Add Year</button>
        </div>

    </section>
</template>

<script setup lang="ts">
import { ArrowRight, Check, ChevronDown, ChevronUp, Edit, Trash, X } from 'lucide-vue-next';
</script>