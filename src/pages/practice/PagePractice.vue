<template>
    <section>
        <span class="tiny-label">Work on To-Do</span>
        <h2>Add Essential Dates of Classical Music History</h2>
        <div class="flex flex-col gap-8 mt-12 items-start">
            <div class="flex flex-row gap-2 items-start">
                <div class="flex flex-row gap-2 justify-center">
                    <button class="btn">
                        <Trash :size="12" />
                    </button>
                    <button class="btn">
                        <Edit :size="12" />
                    </button>
                </div>
                <div class="flex flex-col gap-2 justify-center">
                    <h3>1770</h3>

                    <h4>Beethoven born</h4>
                    <em>A TICK KISSing him as soon as he sees the light of day</em>
                </div>
            </div>
            <div class="flex flex-row gap-2 items-start">
                <div class="flex flex-row gap-2 justify-center">
                    <button class="btn">
                        <Trash :size="12" />
                    </button>
                    <button class="btn">
                        <Edit :size="12" />
                    </button>
                </div>
                <div class="flex flex-col gap-2 justify-center">
                    <h3>1770</h3>

                    <h4>Giuseppe Tartini (violinist) dies</h4>
                    <em>A TICK tartly giving him the KISS of death</em>
                </div>
            </div>



            <div class="flex flex-row gap-2 items-start">
                <div class="flex flex-row gap-2 justify-center">
                    <button class="btn">
                        <Trash :size="12" />
                    </button>
                    <button class="btn  ">
                        <Edit :size="12" />
                    </button>
                </div>
                <div class="flex flex-col gap-2 justify-center">
                    <h3>26.03.1827</h3>

                    <h4>Beethoven dies</h4>
                    <em>no mnemonic.</em>
                </div>
            </div>


            <div class="flex flex-col gap-4 items-start">

                <div class=" flex flex-col gap-2">
                    <input type="text" placeholder="Enter Number" class="min-w-2xl font-bold text-xl" value="1943" />
                    <input type="text" placeholder="Enter Event" class="min-w-2xl" />
                    <input type="text" placeholder="Enter Mnemonic" class="min-w-2xl" />
                    <div class="flex gap-2">
                        <button class="btn">
                            <X :size="12" />
                            Cancel
                        </button>
                        <button class="btn">
                            <Check :size="12" />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <button class="btn">
                <Plus :size="12" />
                Add Event
            </button>
        </div>

    </section>
</template>

<script setup lang="ts">
import { ArrowRight, Check, ChevronDown, ChevronUp, Edit, Plus, Trash, X } from 'lucide-vue-next';
</script>