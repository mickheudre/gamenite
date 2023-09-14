<template>
    <UPopover>
        <UButton icon="i-heroicons-calendar-days-20-solid" color="white" class="capitalize" :label="formatDate(props.modelValue)" />
        <template #panel>
            <vue-cal
            locale="fr"
            class="vuecal--date-picker"
            xsmall
            hide-view-selector
            :time="false"
            active-view="month"
            :disable-views="['week', 'day']"
            style="width: 210px;height: 230px"
            :selectedDate="props.modelValue"
            :minDate="now">
            <template #cell-content="{ cell, view, events }">
                <span class="vuecal__cell-date" @click="updateDate(view.selectedDate)">
                    {{ cell.content }}
                </span>
            </template>
        </vue-cal>
    </template>
</UPopover>
</template>

<script setup lang="ts">
import VueCal from 'vue-cal'

const props = defineProps({modelValue: Date})
const emit = defineEmits(['update:modelValue'])

const now = new Date()

const updateDate = (date: Date) => {
    const updatedDate = new Date()
    updatedDate.setDate(date.getDate())
    updatedDate.setHours(props.modelValue?.getHours())
    updatedDate.setMinutes(props.modelValue?.getMinutes())
    emit("update:modelValue", updatedDate)
}

const formatDate = (date : Date) => {
    return date.toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric"}) 
    
}
</script>


<style>

.month-view {
    @apply overflow-hidden;
}
</style>