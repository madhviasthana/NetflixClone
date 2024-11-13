<template>
    <div class="min-w-[1200px] relative">
        <div class="flex justify-between mr-6">
            <div class="flex items-center font-semibold text-white text-2xl cursor-pointer">
                {{ category }}
            </div>
        </div>
        <div v-for="(movie, index) in movies" :key="index" :class="{ 'active': index === currentMovieIndex }">
        <!-- Movie content -->
        </div>

        <Carousel 
            ref="carousel"
            :modelValue="currentSlide"
            @update:modelValue="updateSlideValue"
            :items-to-show="8" 
            :items-to-scroll="1"
            :wrap-around="true"
            :transition="500"
            snapAlign="start"
            class="bg-transparent"
        >
            <Slide 
                v-for="(slide, index) in movies" 
                :key="slide.name" 
                class="flex items-center object-cover text-white bg-transparent"
            >
                <div 
                    @click="fullScreenVideo(index)"
                    class="object-cover h-[100%] hover:brightness-125 cursor-pointer" 
                    :class="
                        currentSlide !== index ? 'border-4 border-transparent' : 'border-4 border-white',
                        currentSlideObject(slide, index)
                    "
                >
                    <img 
                        style="user-select: none" 
                        class="pointer-events-none h-[100%] z-[-1]" 
                        :src="'/images/'+slide.name+'.png'"
                    >
                </div>
            </Slide>
            <template #addons>
                <Navigation />
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { ref, toRefs, onMounted, onUnmounted } from 'vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import { useMovieStore } from '../stores/movie';
import { storeToRefs } from 'pinia';

const useMovie = useMovieStore();
const { movie, showFullVideo } = storeToRefs(useMovie);

let currentSlide = ref(0);

const props = defineProps({ category: String, movies: Array });
const { movies, category } = toRefs(props);
const emit = defineEmits(['updateSlide']);

const currentSlideObject = (slide, index) => {
    if (index === currentSlide.value) {
        movie.value = slide;
    }
};

const fullScreenVideo = (index) => {
    currentSlide.value = index;
    setTimeout(() => (showFullVideo.value = true), 500);
};

const updateSlideValue = (val) => {
    currentSlide.value = val;
    emit('updateSlide', val); // Emit slide change to the parent
};

// Handle keyboard navigation
const handleKeyboardNavigation = (event) => {
    if (event.key === 'ArrowRight') {
        currentSlide.value = (currentSlide.value + 1) % movies.value.length; // Move to next slide
    } else if (event.key === 'ArrowLeft') {
        currentSlide.value = (currentSlide.value - 1 + movies.value.length) % movies.value.length; // Move to previous slide
    }
};

// Attach and remove event listeners
onMounted(() => {
    window.addEventListener('keydown', handleKeyboardNavigation);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyboardNavigation);
});
</script>

<style>
.carousel__prev, 
.carousel__next, 
.carousel__prev:hover, 
.carousel__next:hover {
    color: white;
}

.active {
    border: 4px solid white; /* Visually highlight the selected movie */
    transition: border-color 0.3s ease; /* Smooth transition for better UX */
}
</style>
