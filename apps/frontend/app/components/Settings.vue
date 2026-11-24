<script setup lang="ts">
import Moon from "@primeicons/vue/moon";
import Sun from "@primeicons/vue/sun";

const {
    resetSettings,
    isDarkMode,
    toggleDarkMode,
    getColors,
    getChessboardColor,
    setChessboardColor,
    isChessboardSpinAutomatic,
    toggleChessboardSpin,
    isPieceAnimationEnabled,
    togglePieceAnimation,
} = useSettings();

const selectedColor = computed({
    get() {
        return getChessboardColor();
    },
    set(color) {
        setChessboardColor(color);
    },
});

const chessboardSpin = computed({
    get() {
        return isChessboardSpinAutomatic();
    },
    set() {
        toggleChessboardSpin();
    },
});

const pieceAnimation = computed({
    get() {
        return isPieceAnimationEnabled();
    },
    set() {
        togglePieceAnimation();
    },
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <label class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-muted-color">Dark mode toggle :</span>
            <Button
                variant="outlined"
                iconOnly
                severity="contrast"
                aria-label="Toggle dark mode"
                @click="toggleDarkMode"
            >
                <Moon v-if="isDarkMode()" />
                <Sun v-else />
            </Button>
        </label>

        <label class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-muted-color">Chessboard color :</span>
            <Select
                v-model="selectedColor"
                :options="getColors()"
                optionLabel="color"
                placeholder="Select a color"
                class="w-40"
            >
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center gap-2">
                        <div :class="[slotProps.value.dark, 'h-5 w-5 rounded-md']"></div>
                        <div class="capitalize">{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <div :class="[slotProps.option.dark, 'h-5 w-5 rounded-md']"></div>
                        <div class="capitalize">{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Select>
        </label>

        <label class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-muted-color">Automatic chessboard spin :</span>
            <ToggleSwitch v-model="chessboardSpin" />
        </label>

        <label class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-muted-color">Piece move animation :</span>
            <ToggleSwitch v-model="pieceAnimation" />
        </label>

        <Button severity="secondary" @click="resetSettings">Reset</Button>
    </div>
</template>
