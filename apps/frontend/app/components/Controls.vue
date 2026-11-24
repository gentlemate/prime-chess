<script setup lang="ts">
import CaretLeft from "@primeicons/vue/caret-left";
import CaretRight from "@primeicons/vue/caret-right";
import StepBackward from "@primeicons/vue/step-backward";
import StepForward from "@primeicons/vue/step-forward";
import Sync from "@primeicons/vue/sync";
</script>

<template>
    <div class="flex gap-2">
        <Button
            class="flex-1"
            variant="outlined"
            iconOnly
            severity="secondary"
            aria-label="First move"
            v-tooltip.top="'First move'"
            placeholder="Top"
            @click="$emit('goToFirstMove')"
        >
            <StepBackward />
        </Button>
        <Button
            class="flex-1"
            variant="outlined"
            iconOnly
            severity="secondary"
            aria-label="Previous move"
            v-tooltip.top="'Previous move'"
            placeholder="Top"
            @click="$emit('goToPreviousMove')"
        >
            <CaretLeft />
        </Button>
        <Button
            class="flex-1"
            iconOnly
            severity="contrast"
            aria-label="Spin"
            v-tooltip.top="'Spin chessboard'"
            placeholder="Top"
            @click="$emit('spinChessboard')"
        >
            <Sync />
        </Button>
        <Button
            class="flex-1"
            variant="outlined"
            iconOnly
            severity="secondary"
            aria-label="Next move"
            v-tooltip.top="'Next move'"
            placeholder="Top"
            @click="$emit('goToNextMove')"
        >
            <CaretRight />
        </Button>
        <Button
            class="flex-1"
            variant="outlined"
            iconOnly
            severity="secondary"
            aria-label="Last move"
            v-tooltip.top="'Last move'"
            placeholder="Top"
            @click="$emit('goToLastMove')"
        >
            <StepForward />
        </Button>
    </div>
</template>
