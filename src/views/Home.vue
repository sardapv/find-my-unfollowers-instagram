<template>
  <div class="w-full h-full overflow-auto flex flex-col justify-center items-center bg-secondary-500">
    <input
      type="text"
      placeholder="Enter your username here"
      class="h-10 px-3 outline-none rounded-tiny mb-7 text-lg w-3/5"
      v-model="username"
      autocomplete="off"
    />
    <div class="flex flex-col items-center mb-5">
      <button class="w-max bg-primary-500 rounded-tiny h-11 px-3 font-normal text-lg text-light-500 shadow-md">
        <router-link :to="'/difference/1/' + username">Find unfollowers 😒</router-link>
      </button>
      <p class="my-2 text-grey-500">List of people you follow, but they don't follow back!</p>
    </div>
    <div class="flex flex-col items-center">
      <button class="w-max bg-primary-500 rounded-tiny h-11 px-3 font-normal text-lg text-light-500 shadow-md">
        <router-link :to="'/difference/0/' + username">Find unfollowing 🤭</router-link>
      </button>
      <p class="my-2 text-grey-500">List of people who follow you, but you don't!</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      username: "",
    };
  },
};
</script>
