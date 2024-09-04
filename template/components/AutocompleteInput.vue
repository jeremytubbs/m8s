<template>
    <div class="relative">
        <input
            :id="id"
            v-model="inputValue"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            :placeholder="placeholder"
            @input="handleInput"
            @focus="showSuggestions = true"
            @blur="handleBlur"
            autocapitalize="off"
            autocomplete="off"
        />
        <slot name="prepend"></slot>
        <button
            v-if="inputValue"
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            @click="clearInput"
        >
            X
            <!-- <IconX class="h-5 w-5 text-gray-400" /> -->
        </button>
        <ul
            v-if="showSuggestions && suggestions.length > 0"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
            <li
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                @mousedown="selectSuggestion(suggestion)"
            >
                {{ suggestion.value }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue"
//   import IconX from './IconX.vue'

const props = defineProps<{
    id: string
    modelValue: string
    fetchSuggestions: (query: string) => Promise<Array<{value: string}>>
    placeholder?: string
}>()

const emit = defineEmits(["update:modelValue", "clear"])

const inputValue = ref(props.modelValue)
const suggestions = ref<Array<{value: string}>>([])
const showSuggestions = ref(false)

watch(
    () => props.modelValue,
    (newValue) => {
        inputValue.value = newValue
    }
)

async function handleInput() {
    emit("update:modelValue", inputValue.value)
    if (inputValue.value) {
        suggestions.value = await props.fetchSuggestions(inputValue.value)
        showSuggestions.value = true
    } else {
        suggestions.value = []
        showSuggestions.value = false
    }
}

function selectSuggestion(suggestion: {value: string}) {
    inputValue.value = suggestion.value
    emit("update:modelValue", suggestion.value)
    showSuggestions.value = false
}

function handleBlur() {
    // Delay hiding suggestions to allow for mousedown event on suggestion
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

function clearInput() {
    inputValue.value = ""
    emit("update:modelValue", "")
    emit("clear")
}
</script>
