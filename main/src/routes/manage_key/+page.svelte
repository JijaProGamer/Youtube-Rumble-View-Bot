<script lang="ts">
	import axios from 'axios';
	import { opts, dataChanged, newData } from '../../background.js';

	let data = opts;
	dataChanged((newData: any) => (data = newData));
	$: newData(data);

	$: changeAPIKey(data.api_key);
	$: changeFreeAPIKey(data.free_api_key);

	let isFreeLoggedIn = false;
	let isPremiumLoggedIn = false;

	function navigate(){
		if(isFreeLoggedIn || isPremiumLoggedIn){
			window.location.href = "/";
		}
	}
	
	async function checkPremiumLoginStatus(){
		let logedInData = (await axios.get(`/api/patreon_status`)).data
		isPremiumLoggedIn = logedInData.status;
	}

	async function checkFreeLoginStatus(){
		let logedInData = (await axios.get(`/api/free_status`)).data
		isFreeLoggedIn = logedInData.status;
	}

	function changeAPIKey(newAPIKey: string) {
		data.api_key = newAPIKey;
	}

    function changeFreeAPIKey(newAPIKey: string) {
		data.free_api_key = newAPIKey;
	}

	setInterval(() => {
		checkFreeLoginStatus().catch(err => {});
		checkPremiumLoginStatus().catch(err => {});
		navigate();
	}, 100);
</script>


<div id="form_container">
	<div class="settings_container container_gray">
        <div class="premium_title">
            <h2 class="key_free_name">Free feature access</h2>
        </div>

        <div class="same_line premium_line">
            <p>
                To get a free access to a subset of the bot's features, 
            </p>
            <p>
                You must watch 3 ads.
            </p>
        </div>

        <div class="same_line premium_line">
            <p>
                To get access to the limited free subset of the bot's features, you must watch 3 ads daily on <a
                    href="https://www.bloxxy.net/api/linkvertise/0">our website</a
                >.
            </p>
        </div>


		<div class="api_inserter">
			<div class="same_line premium_line">
				<p>
					After watching the 3 ads and copying the API key, paste it here, it'll automatically refresh the page IF they key is correct:
				</p>
	
				<input type="text" class="premium_textbox" bind:value={data.free_api_key} style="margin-bottom: 1em;"/>
			</div>
		</div>
	</div>

	<div class="settings_container second_container container_rainbow">
        <div class="premium_title">
            <h2 class="key_type_name">Full feature access</h2>
        </div>

        <div class="same_line premium_line">
            <p>
                Subscribe to our patreon with a subscription of minimum 10 dollars per month for full
                feature access.
            </p>
            <p>
                This will also remove all ads for the month present.
            </p>
        </div>

        <div class="same_line premium_line">
            <p>
                To get access to the full list of features, make an account on <a
                    href="https://www.bloxxy.net/account">our website</a
                >, log in with your patreon and make a 10$ subscription on our
                <a href="https://www.patreon.com/Bloxxy213/membership">patreon</a>.
            </p>
        </div>

        <div class="same_line premium_line">
            <p>
                NOTE: Each subscription lasts one month.
            </p>
        </div>

		<div class="api_inserter">
			<div class="same_line premium_line">
				<p>
					After making a account and logging in with your patreon, copy your API Key and paste it
					here, it'll automatically refresh the page IF they key is correct:
				</p>
	
				<input type="text" class="premium_textbox" bind:value={data.api_key} style="margin-bottom: 1em;"/>
			</div>
		</div>
    </div>
</div>

<style lang="scss">
	.second_container {
		margin-left: auto;
	}

	.api_inserter {
		margin-top: auto;
		margin-bottom: 5%;
	}

	.key_type_name {
		font-size: 3rem;
		font-weight: bold;
		background: linear-gradient(90deg, 
			#ff0000, #ff7f00, #ffff00, #00ff00, 
			#0000ff, #4b0082, #9400d3, #ff0000);
		background-size: 200%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: rainbow-shift 4s linear infinite;
	}

	.key_free_name {
		font-size: 3rem;
		font-weight: bold;
		background: linear-gradient(90deg, 
			#3a3a3a, #5e5e5e, #7a7a7a, #9b9b9b, 
			#b0b0b0, #c5c5c5, #d9d9d9, #5e5e5e);
		background-size: 200%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: rainbow-shift 4s linear infinite;
	}

	.premium_title {
		display: flex;
		align-items: center;

		flex-direction: row;
		justify-content: center;

		margin-top: 3%;
		font-size: 1em;

		margin-bottom: 2rem;
	}

	.same_line {
		margin-top: 0.25rem;
	}

	.premium_textbox {
		background-color: rgb(199, 203, 207);
		color: #232224;

		margin-left: 1%;
	}

	.premium_status {
		font-size: 1.5em;
	}

	.premium_status_normal {
		color: #ff0000;
	}

	.premium_status_premium {
		color: #05f305;
	}

	.premium_line {
		color: rgb(227, 231, 235);
		font-size: 1.5em;

		text-align: center;
	}

	.settings_container {
		background-color: #272c30;
		padding-bottom: 2%;
		margin-bottom: 5%;

		display: flex;
		flex-direction: column;
	}

	.container_gray {
		animation: gray-shadow 3s infinite linear;
		border-radius: 5%;
	}

	.container_rainbow {
		animation: rainbow-shadow 3s infinite linear;
		border-radius: 5%;

	}

	@keyframes rainbow-shadow {
		0%, 100% {
			box-shadow: 0 0 5px #ff0000, 0 0 10px #ff7f00, 0 0 15px #ffff00, 0 0 20px #00ff00,
				0 0 25px #0000ff, 0 0 30px #4b0082, 0 0 35px #9400d3;
		}
		25% {
			box-shadow: 0 0 35px #9400d3, 0 0 5px #ff0000, 0 0 10px #ff7f00, 0 0 15px #ffff00, 0 0 20px #00ff00,
				0 0 25px #0000ff, 0 0 30px #4b0082;
		}
		50% {
			box-shadow: 0 0 30px #4b0082, 0 0 35px #9400d3, 0 0 5px #ff0000, 0 0 10px #ff7f00, 0 0 15px #ffff00, 0 0 20px #00ff00,
				0 0 25px #0000ff;
		}
		75% {
			box-shadow: 0 0 25px #0000ff, 0 0 30px #4b0082, 0 0 35px #9400d3, 0 0 5px #ff0000, 0 0 10px #ff7f00, 0 0 15px #ffff00, 0 0 20px #00ff00;
		}
	}
	
	@keyframes gray-shadow {
		0%, 100% {
			box-shadow: 0 0 5px #3a3a3a, 0 0 10px #5e5e5e, 0 0 15px #7a7a7a, 0 0 20px #9b9b9b,
						0 0 25px #b0b0b0, 0 0 30px #c5c5c5, 0 0 35px #d9d9d9;
		}
		25% {
			box-shadow: 0 0 35px #d9d9d9, 0 0 5px #3a3a3a, 0 0 10px #5e5e5e, 0 0 15px #7a7a7a,
						0 0 20px #9b9b9b, 0 0 25px #b0b0b0, 0 0 30px #c5c5c5;
		}
		50% {
			box-shadow: 0 0 30px #c5c5c5, 0 0 35px #d9d9d9, 0 0 5px #3a3a3a, 0 0 10px #5e5e5e,
						0 0 15px #7a7a7a, 0 0 20px #9b9b9b, 0 0 25px #b0b0b0;
		}
		75% {
			box-shadow: 0 0 25px #b0b0b0, 0 0 30px #c5c5c5, 0 0 35px #d9d9d9, 0 0 5px #3a3a3a,
						0 0 10px #5e5e5e, 0 0 15px #7a7a7a, 0 0 20px #9b9b9b;
		}
	}


	@keyframes rainbow-text {
		0% {
			background-position: 0%;
		}
		100% {
			background-position: 100%;
		}
	}


	#form_container {
		padding-left: 3%;
		padding-top: 3%;
		max-width: 97%;

        height: 100vh;

        display: flex;
        flex-direction: row;
	}

	a {
		font-size: 1.5rem;
		color: rgb(23, 216, 206);
		text-decoration: none;
	}

	@media only screen and (orientation: portrait) {
		.settings_container {
			max-width: 90vw;
            height: 40vh;
			max-height: 40vh;
		}
	}

	@media only screen and (orientation: landscape) {
		.settings_container {
			max-width: 40vw;
            max-height: 80vh;
			height: 80vh;
		}
	}
</style>
