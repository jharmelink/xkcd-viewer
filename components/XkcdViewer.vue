<template>
  <p v-if="$fetchState.pending">Fetching xkcd...</p>
  <p v-else-if="$fetchState.error">Error fetching xkcd :(</p>
  <div v-else class="xkcd">
    <form v-on:submit.prevent="initXkcd(newNumber)">
      <label for="inputNumber">Number:&nbsp;</label>
      <input id="inputNumber" type="text" v-model="newNumber">
      <button type="submit">Load</button>
      <button type="button" v-on:click="initXkcd()">Random</button>
      <label for="inputTimeout">&nbsp;Timeout:&nbsp;</label>
      <input id="inputTimeout" type="text" v-model="timeout">
      <button type="button" v-on:click="switchPlayRandom()" :class="`timer ${isPlaying ? 'active' : ''}`">&nbsp;</button>
    </form>
    <h1>{{ xkcd.title }} <sup>{{ xkcd.day }}-{{ xkcd.month }}-{{ xkcd.year }}</sup></h1>
    <img v-if="xkcd.filename" :src="$config.imagesUrl + '/' + xkcd.filename" :alt="xkcd.description">
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
import {gql, request} from 'graphql-request'
import {Xkcd} from "~/models/xkcd";
import {XkcdResponse} from "~/models/xkcdResponse";

@Component
export default class XkcdViewer extends Vue {

  xkcd: Xkcd = {} as Xkcd;
  newNumber?: Number;
  isPlaying: boolean = false;
  timeout: number = 8000;

  async fetch(): Promise<void> {
    await this.initXkcd();
  }

  switchPlayRandom() {
    this.isPlaying = !this.isPlaying;
    this.playRandom();
  }

  playRandom() {
    if (this.isPlaying) {
      this.initXkcd();
      setTimeout(() => this.playRandom(), this.timeout);
    }
  }

  async initXkcd(input?: Number): Promise<void> {
    await this.getXkcd(input)
        .then(xkcd => {
          this.xkcd = xkcd;
          this.newNumber = xkcd.number;
        });
  }

  private getXkcd(input?: Number): Promise<Xkcd> {
    const variables = !input ? '' : `(number: ${input})`;
    const query = gql`
      query {
        xkcd${variables} {
          number
          url
          filename
          title
          description
          year
          month
          day
        }
      }`;

    return request<XkcdResponse>(this.$config.graphqlUrl, query)
        .then(response => response.xkcd)
  }
}
</script>

<style scoped>
.xkcd {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

form {
  margin: 1em 0;
  display: flex;
}

label {
  display: flex;
  align-items: center;
}
</style>
