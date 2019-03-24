<template>
    <div id="app">
        <form v-on:submit.prevent="getCountries()">
            <v-app id="inspire">
                <v-navigation-drawer
                    fixed
                    :clipped="$vuetify.breakpoint.mdAndUp"
                    app
                    v-model="drawer"
                >
                    <v-list dense>
                        <template v-for="item in items">
                            <v-list-tile
                                @click.prevent="setCriteria(item)"
                                :key="item.text"
                                :class="item.label === criteria ? 'grey lighten-2' : ''"
                            >
                                <v-list-tile-action>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-navigation-drawer>
                <v-toolbar
                    color="blue darken-3"
                    dark
                    app
                    :clipped-left="$vuetify.breakpoint.mdAndUp"
                    fixed
                >
                    <v-toolbar-title style="margin-right: 30px">
                        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                        <span>Search countries</span>
                    </v-toolbar-title>
                    <v-text-field flat solo-inverted :label="searchLabel" v-model="search"></v-text-field>
                    <v-btn large icon type="submit">
                        <v-icon>search</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-content>
                    <v-container fill-height grid-list-md>
                        <v-layout row wrap>
                            <v-flex>
                                <v-data-table
                                    class="elevation-1"
                                    :headers="headers"
                                    :items="countries"
                                    hide-actions
                                >
                                    <template v-slot:items="props">
                                        <td>{{props.item.name}}</td>
                                        <td>{{props.item.capital}}</td>
                                        <td>{{popultaionWithSeperator(props.item.population)}}</td>
                                        <td>{{getCurrencyString(props.item.currencies)}}</td>
                                        <td>{{getLanguagesString(props.item.languages)}}</td>
                                        <td>
                                            <v-img :src="props.item.flag"></v-img>
                                        </td>
                                        <td>
                                            <v-btn
                                                flat
                                                ripple
                                                target="_blank"
                                                :href="'https://www.google.com/maps/place/' + props.item.name"
                                            >
                                                View on Google Maps
                                                <v-icon>place</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-content>
            </v-app>
        </form>
    </div>
</template>

<script>
import Service from "./services"
export default {
	name: "app",
	components: {},
	data() {
		return {
			dialog: false,
			drawer: null,
			criteria: "name",
			search: "",
			searchLabel: "Search by country name. It can be the native name or partial name",
			isMobile: false,
			countries: [],
			headers: [
				{
					text: "Country name",
					value: "name",
				},
				{
					text: "Capital",
					value: "capital",
					sortable: false,
				},
				{
					text: "Population",
					value: "population",
				},
				{
					text: "Currency",
					value: "currencies",
					sortable: false,
				},
				{
					text: "Language",
					value: "languages",
					sortable: false,
				},
				{
					text: "Flag",
					value: "flag",
					sortable: false,
				},
				{
					text: "",
					value: "maps",
					sortable: false,
				},
			],
			items: [
				{
					text: "Country name",
					icon: "label",
					label: "name",
					searchLabel: "Search by country name. It can be the native name or partial name",
				},
				{
					text: "Capital city",
					icon: "location_city",
					label: "capital",
					searchLabel: "Search by capital city",
				},
				{
					text: "Language spoken",
					icon: "chat",
					label: "lang",
					searchLabel: "Search by ISO 639-1 language code (i.e. en, da, fr)",
				},
				{
					text: "Currency",
					icon: "attach_money",
					label: "currency",
					searchLabel: "Search by ISO 4217 currency code (i.e. dkk, eur, usd)",
				},
			],
		}
	},
	watch: {},
	methods: {
		setCriteria(item) {
			this.criteria = item.label
			this.searchLabel = item.searchLabel
			if (this.isMobile) this.drawer = false
			this.getCountries()
		},
		getCountries() {
			if (this.search !== "") {
				Service.getCountries(this.criteria, this.search)
					.then(response => {
						this.countries = response.data
					})
					.catch(err => {
						if (err.response.status === 400 || err.response.status === 404) {
							this.countries = []
						}
						console.error(err.response)
					})
			}
		},
		getCurrencyString(currencies) {
			let currencyString = currencies
				.filter(currency => {
					// Virgin Islands (British) has a currency with code = null, Palau has a currency with code = (none)
					if (currency.code !== null && currency.code !== "(none)") return true
					return false
				})
				.map(currency => {
					return currency.name + " (" + currency.code + ")"
				})
				.join(", ")
			return currencyString
		},
		getLanguagesString(languages) {
			let languagesString = languages
				.map(language => {
					return language.name + " (" + language.nativeName + ")"
				})
				.join(", ")
			return languagesString
		},
		popultaionWithSeperator(population) {
			return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
		},
		onResize() {
			this.isMobile = window.innerWidth < 600
		},
	},
	beforeDestroy() {
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", this.onResize, { passive: true })
		}
	},
	mounted() {
		this.onResize()
		window.addEventListener("resize", this.onResize, { passive: true })
	},
}
</script>

<style lang="scss" scoped>
</style>
