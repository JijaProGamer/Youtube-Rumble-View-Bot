function getE(hostname)
{
	switch (hostname)
	{
		case 'letssingit.com':
		case 'lyricsbox.com':
			return ['cookieconsent=1111'];
		
		case 'kontaktbazar.at':
		case 'hoernews.de':
			return ['cookieconsent_status=dismiss'];
		
		case 'pee.place':
		case 'nearest.place':
		case 'postboxmap.com':
			return ['gdprconsent=1'];
		
		case 'radioaustria.at':
		case 'kronehit.at':
			return ['consent=1'];
		
		case 'binumi.com':
		case 'ravi.pl':
			return ['idcac=1'];
		
		case 'fotoc.dk':
		case 'fjshop.dk':
			return ['cookiedough=1'];
		
		case 'esea.net':
		case 'advodan.dk':
			return ['cookie_consent=1'];
		
		case 'betterhelp.com':
		case 'regain.us':
			return ['gdpr_cookie_consent_given=yes'];
		
		case 'compteur.fr':
		case 'lebens.guru':
			return ['cookies_accepted=1'];
		
		case 'indonesia-publisher.id':
		case 'ciustekno.me':
			return ['cookieLaw=got_it'];
		
		case 'livejasmin.com':
		case 'livesexasian.com':
			return ['is_personalized_content_consent_given=1'];
		
		case 'milkywire.com':
		case 'freeletics.com':
			return ['cookie_consent=true'];
		
		case 'prodyna.com':
		case 'prodyna.ch':
		case 'prodyna.at':
		case 'prodyna.co.uk':
			return ['prodyna-cookies=ALL'];
		
		case 'euroleague.net':
		case 'eurocupbasketball.com':
			return ['modalNotSeenEV=1', 'cookieBanner=true'];
		
		case 'reimageplus.com':
		case 'xn---43-9cdulgg0aog6b.xn--p1ai':
			return ['cookie_accepted=1'];
		
		case 'pruefungshelden.de':
		case 'elopage.com':
			return ['p_consent_accepted_shop=1%2C2'];
		
		case 'elvenar.com':
		case 'forgeofempires.com':
			return ['CookieNotification=1'];
		
		case 'finantia.com': return ['finantia_cookie=active'];
		case 'finantia.es': return ['strictly_necessary=active'];
		case 'domhouse.pl': return ['rodo=1'];
		case 'modelle-hamburg.de': return ['privacypolicy1=1'];
		case 'lubimyczytac.pl': return ['rodoInfo_v_11=1'];
		case 'foodetective.co': return ['cookiesAgreement=accepted'];
		case 'insidebruegel.net': return ['InsideBruegel=init'];
		case 'dwell.com': return ['gdpr=1'];
		case 'telecinco.es': return ['ms_cookies_alert_accepted=true'];
		case 'euroclear.com': return ['cc_necessary=true', 'cc_functional=true', 'cc_analytics=true'];
		case 'appi.org': return ['apa_gdpr_accepted=True'];
		case 'agroneo.com': return ['consent=yes'];
		case 'doc.fr': return ['cookieAgreement=True'];
		case 'payscale.com': return ['accept-cookie=yes'];
		case 'royaldesign.no': return ['cookiesAccepted=1'];
		case 'tkmaxx.com': return ['tjxUser=true'];
		case 'yourstory.com': return ['alreadyVisited=true'];
		case 'pekao.com.pl': return ['gdprAgreed=true'];
		case 'zattoo.com': return ['cookie_policy_agreement=1'];
		case 'hetzner.com': return ['cookies_allowed=1']; // accounts
		case 'ing.nl': return ['cookiepref=1'];
		case 'ing.be': return ['cookiesOptin=true'];
		case 'wallpaperup.com': return ['wup_jwt=1'];
		case 'antyweb.pl': return ['aw-privacy-approval=true']; // zeropln
		case 'archief.amsterdam': return ['verklaring=1'];
		case 'enviam.de': return ['dws01-level=2', 'dws02-level=2'];
		case 'quick.be': return ['cookie-policy-version=2', 'cookie-policy-accepted=1'];
		case 'virustotal.com': return ['euConsent=1', 'tosChangedAccepted=1'];
		case 'cmore.se': return ['cookieBannerDismissed=true'];
		case 'choosist.com': return ['accept_cookie=1'];
		case 'kufar.by': return ['ck=1'];
		case 'ezys.lt': return ['cookie-consent=3'];
		case 'kalenderwoche.de': return ['cookiepolicy=0'];
		case 'poolia.se': return ['cookiePolicyAccepted=1']; // jobb
		case 'researchgate.net': return ['cc=1', 'cookieconsent_dismissed=true'];
		case 'cindicator.com': return ['accepted_cookie=true'];
		case 'atro-provita.de': return ['cookieconsent=true'];
		case 'unicheck.com': return ['unicheck-accepted-cookies=true'];
		case 'gberardi.com': return ['cookie_notify=true'];
		case 'choiceandmedication.org': return ['rgwp_acceptedCookie=1'];
		case 'fiaworldrallycross.com': return ['privacyupdate=1'];
		case 'pansci.asia': return ['panNotiBarCookie=1'];
		case 'willitclassic.com': return ['GDPR:accepted=true'];
		case 'byggshop.se': return ['showCookieWarning=false'];
		case 'blockstack.org': return ['cookiesBanner=ACCEPTED'];
		case 'mypolacy.de': return ['rCoo=1'];
		case 'cruise.jobs': return ['cookie_consent=full'];
		case 'bilety.mazowieckie.com.pl': return ['HideRodoInfo=y'];
		case 'kink.nl': return ['cookieConsent-1.0=%5B%7B%22id%22%3A%22analytics%22%2C%22active%22%3Atrue%7D%2C%7B%22id%22%3A%22advertisement%22%2C%22active%22%3Atrue%7D%2C%7B%22id%22%3A%22social%22%2C%22active%22%3Atrue%7D%5D'];
		case 'epapern.present-perfect.de': return ['cookie_epapern_05_2018_accept=1'];
		case 'multikino.pl': return ['PPC=true'];
		case 'portugalforum.org': return ['xf_eucookie=1']; // e
		case 'slovenia.info': return ['cnotice=1'];
		case 'aktionsfinder.at': return ['cksntc=true'];
		case 'bosch-climate.be': return ['BoschTTBECookieConsent=%7B%22comfort%22%3Atrue%2C%22marketing%22%3Afalse%7D']; // webbooking
		case 'gyakorikerdesek.hu': return ['cookieok=1']; // e
		case 'cruisebare.com': return ['crb_popup_disable=1'];
		case 'vaneesterenmuseum.nl': return ['eesterenpopupv2=cookie-set'];
		case 'e-horyzont.pl': return ['user_allowed_save_cookie_m2=%7B%221%22%3A1%7D'];
		case 'lonewolfonline.net': return ['visited=yes'];
		case 'bookchoice.com': return ['cookie-policy-accepted=true'];
		case 'codementor.io': return ['cm-general_cookie-consent=true'];
		case 'e-syntagografisi.gr': return ['cookieconsent_status=1']; // /p-rv/p
		case 'werkenbijhanos.nl': return ['cd=1'];
		case 'mondo-tech.it': return ['accettacookie=ok'];
		case 'decrypt.co': return ['GDPR_Settings=%7B%22doNotTrack%22%3Afalse%7D'];
		case 'wetter.team': return ['DSVGO=true'];
		case 'coffeecollective.dk': return ['CC_WEB_COOKIE_CONSENT=true'];
		case 'distrokid.com': return ['DK_COOKIE_ACCEPT=true'];
		case 'bakkt.com': return ['iceBanner=PrivacyBakkt0101'];
		case 'hartfordbusiness.com': return ['Drupal.visitor.WEBSITECOOKIEALLOWED=YES'];
		case 'vostron.com': return ['vostronCookieAcceptance=true'];
		case 'flens.de': return ['flens-cookie=1'];
		case 'my.dhlparcel.nl': return ['cookie-agreed=2'];
		case 'waitrose.com': return ['wtr_cookie_consent=1'];
		case 'wearebo.co.uk': return ['hasUserAgreed=true'];
		case 'lucky7bonus.com': return ['messageClosed=1'];
		case 'otomoto.pl': return ['cookieBarSeen=true'];
		case 'heineken.hr': return ['gaOptOut=false'];
		case 'cimri.com': return ['CimriCookiePolicy=1'];
		case 'globalplayer.com': return ['consentUUID=382584da-af8a-469e-aedf-11ac420ec96d'];
		case 'dehn.de': return ['cookie-agreed=1', 'cookie-processed-02=ck_1:true%2Cck_2:true'];
		case 'crtm.es': return ['crtmcookiesCAnaliticas=1', 'crtmcookiesProtDatos=1'];
		case 'computertotaal.nl': return ['SITE_COOKIE_CONSENT=True'];
		case 'vodafoneziggo.nl': return ['cookies-accepted=true'];
		case 'frankfurt.de': return ['cookieAccepted=needed---piwik'];
		case 'hackerrank.com': return ['show_cookie_banner=false'];
		case 'kfc.ru': return ['cookieAccess=1'];
		case 'radiodienste.de': return ['cookieinfo=1'];
		case 'creditkarma.co.uk': return ['cc_cookie_accept=cc_cookie_accept'];
		case 'dofsimulator.net': return ['cookieSettings=cookie'];
		case 'magyarorszag.hu': return ['cookies_ok=1'];
		case 'dfds.com': return ['GDPR=true'];
		case 'tarnkappe.info': return ['CM_cookieConsent=1'];
		case 'celo.org': return ['__responded_to_consent__=true'];
		case 'eduelo.pl': return ['cookies=1'];
		case 'plex.tv': return ['plex_tv_cookie_consent=2'];
		case 'forumactif.org': return ['dntfa_banner=1'];
		case 'vitra.com': return ['vitra_constent=performance'];
		case 'usi.it': return ['priv=ok', 'approvecockie1=ok'];
		case 'xercise4less.co.uk': return ['X4LCookiesAccepted=true'];
		case 'inyourarea.co.uk': return ['cookie_seen=true'];
		case 'carrefour.pl': return ['ec4CookiesSettings=false'];
		case 'welovedevs.com': return ['userDismissedCookiesWarning=true'];
		case 'tureckisklep.pl': return ['condition_1=1'];
		case 'regus.com': return ['cpa=accepted'];
		case 'devias.io': return ['devias_consent=c1:1|c2:1', 'consent=true'];
		case 'neuefische.de': return ['cookiesAccepted=true'];
		case 'waldlandwelt.de': return ['c=j'];
		case 'pluto.tv': return ['tos_acceptance_date=1596261209788'];
		case 'thecycleverse.com': return ['AMPLCONS_internal=true'];
		case 'pagetiger.com': return ['cookie-preferences={%22acceptedAnalyticsCookie%22:true}'];
		case 'tv-trwam.pl': return ['HAS_COOKIES_FORM_SHOWED=true', 'ARE_REQUIRED_COOKIES_ACCEPTED=true'];
		case 'phish-test.de': return ['gtag=true'];
		case 'sea-seek.com': return ['OK_Cook=OK'];
		case 'dajar.cz': return ['cookieNoticeAccept=true'];
		case 'jobalert.ie': return ['hasAcceptedCookies=true'];
		case 'netztest.at': return ['RMBTTermsV6=true'];
		case 'gaana.com': return ['gdprv1=1'];
		case 'cleanairgm.com': return ['cleanair=%7B%22cookiesEssential%22%3Atrue%7D'];
		case 'e-fundresearch.com': return ['cookieinfo={%22functional%22:true}'];
		case 'elkem.com': return ['ConsentClosed=1'];
		case 'tonershop.at': return ['cc_granted=true'];
		case 'verce.me': return ['verceCookieApproved=true'];
		case 'kjell.com': return ['ccValues=1|2'];
		case 'aimotive.com': return ['data-protection=true'];
		case 'parcel2go.com': return ['COOKIE_PROMPT=1'];
		case 'steigmiller.bio': return ['fvw_privacy=enabled'];
		case 'kinoheld.de': return ['KHCONSENT=accept'];
		case 'calm.com': return ['has-agreed-to-cookies=true'];
		case 'resursbank.se': return ['cookie_consent=necessary%3A1%2Cstatistics%3A0%2Cmarketing%3A0'];
		case 'airmates.eu': return ['privacy-dialog-shown=true'];
		case 'mentimeter.com': return ['has_approved_cookie_policy=1'];
		case 'baukobox.de': return ['bb_dsgvo=true'];
		case 'delta.app': return ['cookie-consent-given=true'];
		case 'kayak.fr': return ['DATA_CONSENT=false'];
		case 'theathletic.com': return ['cookie-policy-accept=0', 'cookie-policy-optout=analyticaltracking'];
		case 'kayak.co.uk': return ['DATA_CONSENT=true'];
		case 'mymoria.de': return ['gatsbyConsentMandatory=true'];
		case 'peticie.com': return ['num_times_cookie_consent_banner_shown=1'];
		case 'tgz-ol.de': return ['cookies_consent=1'];
		case 'dunhamssports.com': return ['dw_cookies_accepted=0'];
		case 'evangelisch.de': return ['bigfoot_cookie-consent=true'];
		case 'ubi2.wit.edu.pl': return ['GPRD=128'];
		case 'outandaboutlive.co.uk': return ['cookie-control=true'];
		case 'tesa.com': return ['cookies_informed=true'];
		case 'turboimagehost.com': return ['cookiewarn=1'];
		case 'mubi.com': return ['mubi-cookie-consent=allow'];
		case 'ersatzteilshop.de': return ['cookie-preference=1'];
		case 'svenskaspel.se': return ['cookie_consent={\"ad\":false,\"personalized\":false,\"analytics\":false,\"provision\":false,\"version\":2}'];
		case 'restegourmet.de': return ['consent_accepted=1'];
		case 'sachsenenergie.de': return ['cookiesAccepted=true'];
		case 'cire.pl': return ['APP_A_COOKIES_TERMS_AND_CONDITIONS=true', 'APP_A_COOKIES_FUNCTIONAL=false', 'APP_A_COOKIES_PERFORMANCE=false', 'APP_A_COOKIES_MARKETING=false', 'APP_A_COOKIES_POLICY=true'];
		case 'pretto.fr': return ['tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Bing%20Ads%22:false%2C%22Facebook%20Pixel%22:false%2C%22Google%20AdWords%20New%22:false%2C%22Google%20Cloud%20PubSub%22:false%2C%22Google%20Tag%20Manager%22:false%2C%22PERSONAS%20-%20Google%20AdWords%22:false}%2C%22custom%22:{%22advertising%22:false%2C%22marketingAndAnalytics%22:false}}'];
	}
	
	
	var parts = hostname.split('.');
	
	if (parts.length > 2)
	{
		parts.shift();
		return getE(parts.join('.'));
	}
	
	return false;
}


var hostname = document.location.hostname.replace(/^w{2,3}\d*\./i, ''),
	cookies = getE(hostname);

if (cookies)
{
	var counter = 0;
	
	cookies.forEach(function(cookie){
		cookie = cookie.split('=');
		var parts = ('; ' + document.cookie).split('; ' + cookie[0] + '=');
		
		if (parts.length < 2 || parts[1].split(';')[0] != cookie[1])
		{
			// First try to delete the cookie
			
			if (parts.length > 1) {
				var domain_parts = hostname.split('.');
				
				while (domain_parts.length > 1) {
					document.cookie = cookie[0] + '=; domain=' + domain_parts.join('.') + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					domain_parts.shift();
				}
			}
			
			document.cookie = cookie[0] + '=' + cookie[1];
			counter++;
		}
	});
	
	// Reload if cookies are enabled
	if (counter > 0 && document.cookie.length > 0)
		document.location.reload();
}