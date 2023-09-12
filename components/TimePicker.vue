<template>
<UInput v-model="props.modelValue" type="time" />
</template>

<script setup lang="ts">

const props = defineProps({modelValue: String})
const emit =  defineEmits(['update:modelValue'])

console.log(props.modelValue)
const displayTime = ref(props.modelValue?.toLocaleTimeString("fr", {hour: "numeric", minute: "numeric"}))
const currentDay = ref(props.modelValue)

watch(displayTime, (time) => {
    console.log(time)
    const date = new Date(props.modelValue?.toDateString() + ' ' + time)

    console.log(date)
    emit('update:modelValue', date)
})
</script>