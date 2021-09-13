<template>
  <div
    class="h-full w-full flex flex-col items-start bg-secondary-500"
    :class="{ 'grid place-content-center': listToDisplay.length === 0 }"
  >
    <spinner v-if="listToDisplay.length === 0 && !finished"></spinner>
    <div class="mt-3 text-grey-500 text-sm text-center" v-if="listToDisplay.length === 0">
      {{
        !finished
          ? "Hold on 🍺, while we generate the list 😈"
          : "Oops, seems like its not your username or you have no unfollowers/unfollowings 🧐"
      }}
    </div>
    <div v-if="listToDisplay.length !== 0" class="h-10 w-full inline-flex items-center justify-center my-3 px-3">
      <div
        class="
          cursor-pointer
          flex-grow
          h-10
          bg-primary-500
          rounded-tiny
          shadow-lg
          text-light-500 text-lg
          grid
          place-content-center
        "
        @click="download()"
      >
        Click to save this list 🍺
      </div>
    </div>
    <div class="w-full flex-grow p-1 bg-secondary-500">
      <div
        class="inline-flex items-center w-full py-1 hover:bg-secondary-400"
        v-for="person of listToDisplay"
        :key="person.usernmae"
      >
        <div class="p-1 mx-2">
          <img
            :src="person.profile_pic_url"
            alt="profilepic"
            class="h-10 w-10 rounded-full"
            loading="lazy"
            crossorigin="anonymous"
          />
        </div>
        <a
          class="flex flex-col items-start text-sm flex-grow"
          target="_blank"
          :href="'https://www.instagram.com/' + person.username"
        >
          <div class="text-light-500">
            {{ person.full_name }}
          </div>
          <div class="text-grey-500">@{{ person.username }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import axios from "axios";
export default {
  components: {
    Spinner,
  },
  data() {
    return {
      differenceList: [],
      finished: false,
    };
  },
  computed: {
    listToDisplay() {
      console.log(JSON.parse(JSON.stringify(this.differenceList)));
      return this.differenceList;
    },
  },
  mounted: async function () {
    let followers = [];
    let followings = [];
    /*get graphQLID for further apis*/
    let response;
    try {
      response = await axios.get(`https://www.instagram.com/${this.id}/?__a=1`);
    } catch (error) {
      this.finished = true;
      return;
    }
    const {
      data: {
        graphql: {
          user: { id: graphqlUserID },
        },
      },
    } = response;
    followers = await this.getListOfPeople(graphqlUserID, "1");
    followings = await this.getListOfPeople(graphqlUserID, "0");

    this.differenceList =
      this.mode === "1" ? this.getUnfollowers(followers, followings) : this.getUnfollowings(followers, followings);
    this.finished = true;
  },
  methods: {
    getListOfPeople: async function (graphqlUserId, mode) {
      let after = null,
        has_next = true;
      let listOfPeople = [];
      const queryHash = mode === "1" ? "c76146de99bb02f6415203be841dd25a" : "d04b0a864b4b54837c0d870b0e77e076";

      /* get the list of followers if mode 1 or find followings */
      while (has_next) {
        let graphqlUserID = graphqlUserId;

        let response = await axios.get(
          `https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=` +
            encodeURIComponent(
              JSON.stringify({
                id: graphqlUserID,
                include_reel: false,
                fetch_mutual: true,
                first: 100,
                after: after,
              })
            )
        );
        const {
          data: {
            data: {
              user: {
                [mode === "1" ? "edge_followed_by" : "edge_follow"]: {
                  edges,
                  page_info: { has_next_page, end_cursor },
                },
              },
            },
          },
        } = response;

        has_next = has_next_page;
        after = end_cursor;

        listOfPeople = listOfPeople.concat(
          edges.map(({ node: { username, full_name, profile_pic_url } }) => {
            return {
              username,
              full_name,
              profile_pic_url,
            };
          })
        );
      }
      return listOfPeople;
    },
    getUnfollowings: function (followers, followings) {
      return followers.filter((x) => !followings.some((y) => y.username === x.username));
    },
    getUnfollowers: function (followers, followings) {
      return followings.filter((x) => !followers.some((y) => y.username === x.username));
    },
    download() {
      let csvContent =
        "data:text/csv;charset=utf-8," + this.differenceList.map((e) => e.username + "," + e.full_name + "\n");
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", this.mode === "1" ? "my_insta_unfollowers.csv" : "my_insta_unfollowings.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    },
  },
  props: ["id", "mode"],
};
</script>

<style>
::-webkit-scrollbar-track-piece {
  background-color: #201b2c;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  --tw-bg-opacity: 1;
  background-color: #413757;
  width: 150px;
  height: 150px;
}
</style>
