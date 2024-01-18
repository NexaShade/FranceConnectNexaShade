///////////////////////////////////////////
// JSP: login.jsp
// Description: Verifie la validite du NIR
// Retour: Indicateur de la validite du NIR
///////////////////////////////////////////

/* Pour ajouter les ' ' sur le nir */
function formatterNIRWithSpace(inputId, event) {
	var element = document.getElementById(inputId);
	var nirFormat = '';
	// On ne va pas plus loin si l'input n'existe pas
	if (!element) return false;		
	// On reset le formattage
	element.value = element.value.split(' ').join('');
	// On mappe le champ cach� dans le champ de saisie (en formattant le nir)
	for (var index = 0; index < Math.min(element.value.length, 13); index++) {
		if (element.value[index] && element.value[index] != ' ') {
			nirFormat += element.value[index];
			// Ajout d'un espace
			if (index == 0 || index == 2 || index == 4 || index == 6 || index == 9) {
				nirFormat += ' ';
			}
			
		}
	}
	// Mise a jour de la valeur 
	element.value = nirFormat;

	setTimeout(function(){ 
		element.setSelectionRange(element.value.length, element.value.length);
	}, 0);
};

//Methode permettant de gerer le cas ou l'assure copie/colle son NIR, 
// ou s'il pr�selectionne un nir (pr�ferences navigateur)
function handleSuppression(inputId, event) {
	var element = document.getElementById(inputId);
	var key = event.keyCode || event.which;
	if (key == 8) {
		element.value = element.value.trim();
	}
};


function isNirValid(sText) {
	sText = sText.split(' ').join('');
	if (sText.length !== 13) {
		return false;
	}
	var thisChar;
	var validChars = "0123456789";
	var validChars7 = "ABab";
	for (var i = 0; i < sText.length; i++) {
		thisChar = sText.charAt(i);
		if (validChars.indexOf(thisChar) === -1 && (i !== 6 || (validChars7.indexOf(thisChar) === -1))) {
			return false;
		}
	}
	return true;
}

function checkNir() {
	var nirElement = document.getElementById('inputNir');
	var elementErreur = document.getElementById('erreurSaisieNir');
	if(isNirValid(document.getElementById('j_username').value)) {
		// On supprime la classe CSS pour les erreurs
		nirElement.classList.remove('erreur_champ');
		// On supprime le message d'erreur et on ajoute la classe qui rend invisible la zone d'erreur
		elementErreur.innerHTML = "";
		elementErreur.classList.add('messageErreur_invisible');
	}
	else {
		// On ajoute la classe CSS pour les erreurs
    	nirElement.classList.add('erreur_champ');
        // On ajoute le message d'erreur dans la zone pr�vue et on supprime la classe qui la rend invisible
    	elementErreur.innerHTML = messages_nirIncorrect;
    	elementErreur.classList.remove('messageErreur_invisible');
	}
}

//On v�rifie si les champs sont correctement renseignes pour activer le bouton de connexion
function enableBoutonLogin(codeErreur) {
	if(isNirValid(document.getElementById('j_username').value) && document.getElementById('j_password').value) {
		if(document.getElementById('j_ddn') != null) {
			if(isDnaValid(document.getElementById('j_ddn').value)) {
				document.getElementById('boutonConnect').disabled=false;
				griserBouton(codeErreur,'login');
			} else {
				document.getElementById('boutonConnect').disabled=true;
			}
		} else {
			document.getElementById('boutonConnect').disabled=false;
			griserBouton(codeErreur,'login');
		}
	} else {
		document.getElementById('boutonConnect').disabled=true;
	}
}

///////////////////////////////////////////
// JSP: login.jsp
// Description: Verifie la validite de la date de naissance
// Retour: Indicateur de la validite de la date de naissance
///////////////////////////////////////////

/* Pour ajouter les '/' pendant la saisie de la date de naissance */
function formateDna(evenement) {
	var touche = window.event ? evenement.keyCode : evenement.which;
	if(touche != 8) {
		var ddnElement = document.getElementById('j_ddn').value;
		if(ddnElement.length == 2 || ddnElement.length == 5) {
			ddnElement = ddnElement + '/';
		}
		document.getElementById('j_ddn').value = ddnElement;
	}
	return true;
}

function isDnaValid(sText) {
	// Si la date tap�e est au format jjmmaaaa alors on ajoute automatiquement les slashs et on v�rifie la conformit� apr�s
	if(sText.length === 8) {
		sText = sText.substring(0, 2) + '/' + sText.substring(2, 4)+ '/' + sText.substring(4, 8);
	}
	if (sText.length !== 10 || sText.charAt(2) !== '/' || sText.charAt(5) !== '/') {
		return false;
	}

	sDD = sText.substring(0, 2);
	sMM = sText.substring(3, 5);
	sAAAA = sText.substring(6, 10);

	if (isNaN(sDD) || isNaN(sMM) || isNaN(sAAAA)) {
		return false;
	}

	dd = Number(sDD);
	mm = Number(sMM);
	aaaa = Number(sAAAA);
	if (dd > 99 || dd < 1 || mm > 99 || mm < 1 || aaaa > 9999 || aaaa < 0 ) {
		return false;
	}
	//On ajoute dans le formulaire la valeur recalcul�e avec les slashs
	document.getElementById('j_ddn').value = sText;
	return true;
}

function checkDna() {
	var ddnElement = document.getElementById('inputDdn');
	var elementErreur = document.getElementById('erreurSaisieDdn');
	if(isDnaValid(document.getElementById('j_ddn').value)) {
		// On supprime la classe CSS pour les erreurs
		ddnElement.classList.remove('erreur_champ');
		// On supprime le message d'erreur et on ajoute la classe qui rend invisible la zone d'erreur
		elementErreur.innerHTML = "";
		elementErreur.classList.add('messageErreur_invisible');
		document.getElementById('boutonConnect').disabled=false;
	}
	else {
		// On ajoute la classe CSS pour les erreurs
    	ddnElement.classList.add('erreur_champ');
        // On ajoute le message d'erreur dans la zone pr�vue et on supprime la classe qui la rend invisible
    	elementErreur.innerHTML = messages_dateNaissanceIncorrecte;
    	elementErreur.classList.remove('messageErreur_invisible');
    	document.getElementById('boutonConnect').disabled=true;
	}
}


///////////////////////////////////////////
//Description: Verifie la validite du CP
//Retour: Indicateur de la validite du CP
///////////////////////////////////////////
function isCpValid(sText) {
	if (sText.length !== 5) {
		return false;
	}
	var validChars = "0123456789";
	for (var i = 0; i < sText.length; i++) {
		if (validChars.indexOf(sText.charAt(i)) === -1) {
			return false;
		}
	}
	return true;
}

/**
 * Afficher le div de message pour cookies
 *
 * @param pIdDivCookies
 * @return
 */
function afficherMsgDuCoockies(pIdDivCookies){
	// Afficher ou masquer pIdDivCookies
	Aide(pIdDivCookies);
}

/**
 * Tester si les cookies sont d�sactiv�s
 *
 * true si les cookies d�sactiv�s
 * @return
 */
function isCookiesDesactives(){
	return !navigator.cookieEnabled;
}

///////////////////////////////////////////
// JSP: toutes
// Description: Cache la barre de navigation du navigateur
///////////////////////////////////////////
function hideURLbar(){
	window.scrollTo(0,1);
}

///////////////////////////////////////////
// JSP: login.jsp et pages de modifications
//Description: Cache le clavier lors de l'appui sur la touche de validation du clavier
///////////////////////////////////////////
function hideKeyboard(){
	var i = 0;
	while (e = document.getElementsByTagName('input')[i++]) {
		if (e.focus) e.blur();
	}
}

/*
 * Fonction pour mettre dans l'ordre la date de naissace
 */
function dateNaissanceUtilisateurDesordreVersOrdre(dateNaissance){
	var dateNaissanceUtilisateurOrdre = new String(
			dateNaissance.substring(6, 8) +
			dateNaissance.substring(4, 6) +
			dateNaissance.substring(0, 4)
		);
	return dateNaissanceUtilisateurOrdre;
}

///////////////////////////////////////////
//JSP: toutes les JSP ayant une aide
//Description: Affiche la zone d'aide
//Retour: Aucun
///////////////////////////////////////////
function Aide(idAide){
	var el = document.getElementById(idAide);
	if (el.style.display === 'block'){
		el.style.display = 'none';
	} else {
		el.style.display = 'block';
	}
}

function AideUnique(idAide){
	var el = document.getElementById(idAide);
	
	if(el.style.display=='block'){
		el.style.display ='none';
	}
	else{
		el.style.display = 'block';
	}
}

function cacherClavierEtValiderForm(event, action) {
	if (event.which === 13 || event.keyCode === 13) {
		// Cache le clavier et v�rifie les champs textes quand on fait "entrer"
		hideKeyboard();
		action();
	}
	return true;
}

/**
 * Valider le formulaire de login
 *
 * @return
 */
function validerFormLogin() {
	// Verif NIR
	var nir = document.getElementById('j_username').value;
	if (nir === null || nir === '') {
		// Erreur nir vide
		document.getElementById('divErreur').innerHTML = messages_nirVide;
		return false;
	} else {
		nir = nir.toUpperCase();
		if (!isNirValid(nir)) {
			// Erreur nir invalide
			document.getElementById('divErreur').innerHTML = messages_nirIncorrect;
			return false;
		}
	}
	// Nir toUpperCase
	document.getElementById('j_username').value = nir;

	// Verif code
	var code = document.getElementById('j_password').value;
	if (code === null || code === '') {
		// Erreur code vide
		document.getElementById('divErreur').innerHTML = messages_codeIncorrect;
		return false;
	}

	// Verif dna
	var elemDna = document.getElementById('j_ddn');
	if (elemDna !== null) {
		var dna = elemDna.value;
	    if (dna === '') {
		  // Erreur dna vide
		  document.getElementById('divErreur').innerHTML = messages_dateNaissanceVide;
		  return false;
	    } else {
		  if (!isDnaValid(dna)) {
			// Erreur dna invalide
			document.getElementById('divErreur').innerHTML = messages_dateNaissanceIncorrecte;
			return false;
		  }
	    }
	}
	return true;
}



/* ***** Pour l'authentification renforc�e ***** */

/* ********* Vitale ********* */

//Permet de g�rer le volet retractable pour les infos sur la carte Vitale
function panneauVitale(id, idLien) {
	//Pour afficher/cacher le volet retractable
	Aide(id);
	//Pour modifier l'image "fleche" qui indique ouvert ou fermer
	var el = document.getElementById(idLien);
	if (el.getAttribute('aria-expanded') === 'false'){
		el.setAttribute('aria-expanded', 'true');
	} else {
		el.setAttribute('aria-expanded', 'false');
	}
}

//M�thode appel�e lorsque le champ de saisie Vitale perd le focus (event blur)
function saisieVitaleFinie(typeVitale) {
	enableBouton(typeVitale);
}

//M�thode appel�e lorsque le champ de saisie Vitale re�oit des donn�es (event input)
function saisieVitaleEnCours(event, typeVitale) {
	if ((event.which && event.which != 13) && (event.keyCode && event.keyCode != 13)){
		var pos = doGetCaretPosition(this);
		enableBouton(typeVitale);
		this.focus();
		this.setSelectionRange(pos, pos);
	}
}

//Methode pour le cont�le du num�ro de s�rie
function controleNumeroSerie(champ, erreur, liste){
	var value = champ.value;
	if(value == "") {
		erreurChamp('erreurZoneVitale', erreur_vitale_obligatoire, 'messageErreurVitale');
	}
	else {
		if(controlePlusieursTaille(value,liste)){
			//Si le champ est correct alors on enleve l'eventuelle erreur
			champOK('erreurZoneVitale', 'messageErreurVitale');
			return true;
		}
		else {
			erreurChamp('erreurZoneVitale', erreur, 'messageErreurVitale');
			return false;
		}
	}
}

//Methode pour le contr�le de plusieurs tailles du num�ro de s�rie de la carte Vitale
function controlePlusieursTaille(value,liste){
	for (var i=0; i<liste.length;i++) {
		var regCarac = new RegExp('^[0-9]{' + liste[i] + '}$', 'g');
    	if(regCarac.test(value)){
			return true;
		}
	}
	return false;
}


/* ********** OTP ********** */

// D�s qu'une valeur est entr�e dans un champ OTP, on v�rifie si on doit activer le bouton de connexion
// et si la valeur est autoris�e
function saisieOTP(event, current, typeVitale) {
	if ((event.which && event.which != 13) && (event.keyCode && event.keyCode != 13)){
		enableBouton(typeVitale);
		Autotab(current, "numOTP", event, erreur_otp_format);
	};
}

// Gestion de la saisie du code OTP
// -> gestion des touches clavier
// -> passage d'un input au suivant ou pr�c�dent
// -> contr�le de la valeur entr�e
// -> affichage �ventuel d'erreurs
function Autotab(current, name, evenement, erreur) {
	if(evenement != undefined){
		var touche = window.event ? evenement.keyCode : evenement.which;
		var reg = new RegExp('^[0-9]{1}', 'g');
		var next = current + 1;
		var previous = current - 1;
		//Si l'assure clique sur retour
		if (touche == 8){
			if(current!=1){
				document.getElementById(name+previous).focus();
				document.getElementById(name+previous).value=document.getElementById(name+previous).value;
				//document.getElementById(name+previous).select();
			}
		} else {
			//Si l'assure clique sur la fleche droite et que la case actuelle n'est pas la derni�re
			if(touche == 39 && (current!=6)){
				document.getElementById(name+next).focus();
				document.getElementById(name+next).select();
			//Si l'assure clique sur la fleche gauche
			} else if(touche == 37){
				//et qu'il n'est pas sur la premi�re case
				if(current!=1){
					//On passe au champ suivant
					document.getElementById(name+previous).focus();
					document.getElementById(name+previous).select();
				}else{
					//On reste o� on est
					document.getElementById(name+current).select();
				}
			//Si l'assure clique sur la tabulation 
			} else if ((touche == 9) && (document.getElementById(name+current).value!='')){
				document.getElementById(name+current).select();
			//Si l'assure n'a pas cliqu� sur maj on fait le traitement par rapport au contenu la case actuelle
			} else if(touche != 16){ 
				if(controleOTP(document.getElementById(name+current))){
					if (current != 6){
						// on va sur le prochain champ
						document.getElementById(name+next).focus();
						document.getElementById(name+next).select();
					}else{
						// on reste sur le champ actuel
						document.getElementById(name+current).focus();
					}
				} else{
					// On ajoute une erreur si le champ n'est pas vide (car caractere interdit)
					if (document.getElementById(name+current).value != ''){
						var pos = doGetCaretPosition(document.getElementById(name+current));
						erreurChamp('erreurZoneOTP',erreur, 'messageErreurOTP');
						document.getElementById(name+current).focus();
						document.getElementById(name+current).setSelectionRange(pos, pos);
					}
					document.getElementById(name+current).focus();
				}
			}
		}
	}
}

// En sortant d'un champ OTP, on verifie s'ils sont remplis
function saisieOTPfinie() {
	//Tous les champs vides
	if(!document.getElementById('numOTP1').value
		&& !document.getElementById('numOTP2').value
		&& !document.getElementById('numOTP3').value
		&& !document.getElementById('numOTP4').value
		&& !document.getElementById('numOTP5').value
		&& !document.getElementById('numOTP6').value) {
		erreurChamp('erreurZoneOTP',erreur_otp_obligatoire, 'messageErreurOTP');
	}
}

// Controle la validit� de la valeur d'un champ de l'OTP (uniquement des chiffres)
function controleOTP(champElement){
	var regCarac = new RegExp('^[0-9]{1}$', 'g');
	var value = champElement.value;
	if(value && regCarac.test(value)){
		return true;
	}else {
		return false;
	}
}

//Methode qui va calculer la position du curseur dans un champ de saisie
function doGetCaretPosition(oField) {
	var iCaretPos = 0;
	if(document.selection) {
		oField.focus();
		var oSel = document.selection.createRange();
		oSel.moveStart('character', -oField.value.length);
		iCaretPos = oSel.text.length;
	}
	else if (oField.selectionStart || oField.selectionStart == '0') {
		iCaretPos = oField.selectionStart;
	}
	return iCaretPos;
}

//Methode pour le split de l'OTP si l'assure fait un coller dans la premiere case
function splitOTP(current){
	var contenu = document.getElementById('numOTP'+current).value;
	if(contenu.length > 1){
		//remplissage des autre champs selon la valeur du champ
		for (i=0; (i<6 && i<contenu.length); i++) {
			var next = current + i;
			if(next<7){
				document.getElementById('numOTP'+next).value = contenu.charAt(i);
				document.getElementById('numOTP'+next).focus();
			}				
		}
	}
}

//Methode pour appeler la fonction de generation d'un nouveau code OTP
function ajaxCallRemoteGenererOTP(context, evenement, nir, ddn, rang, process){
	//On d�sactive le bouton le temps de l'appel
	document.getElementById('BoutonGenerationOTP').disabled=true;
	//On cache l'�ventuel ancien message
	document.getElementById('MessageGenerationOTP').style.display="none";
	document.getElementById('MessageGenerationOTPOK').style.display="none";
	if(document.getElementById('divErreur') != null) {
		document.getElementById('divErreur').classList.add('invisible');
	}
	
	var functionActionUrl = context + '/j_spring_security_check';
	
	var params = "input=OTP&j_username="+encodeURIComponent(nir)+"&j_ddn="+encodeURIComponent(ddn)+"&j_rang="+encodeURIComponent(rang)+"&j_process="+encodeURIComponent(process);
	
	if (window.XMLHttpRequest)
	{	// Non-IE browsers
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{	// IE
		req = new ActiveXObject('Microsoft.XMLHTTP');
	}
	req.open('POST', functionActionUrl, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.onreadystatechange = afficherConfirmationOTP;
	req.send(params);
	return;
}

//Methode private qui traite le retour de l'appel de ajaxCallRemoteValiderConsentement
function afficherConfirmationOTP() {
	if (req.readyState == 4)
	{ 	// Complete
		if (req.status == 200)
		{ 	// OK response
			afficherMessageOTP(req);
		 }
	}
}

// Methode qui va traiter la r�ponse de l'appel � la g�n�ration d'un nouvel OTP
function afficherMessageOTP(req){
	//On r�cup�re les params de l'url
	 var splitUrl = req.responseURL.split('&');
	var taille = splitUrl.length;
	//Si pas de params -> r�ponse OK
	if(taille == 1) {
		generationOTPOK();
	} 
	//Si params -> r�ponse KO
	else {
		var codeErreur = null;
		var blocageDate = null;
		var blocageHeure = null;
		//On boucle sur les params pour r�cup�rer les diff�rentes valeurs
		for (var i=0; i<taille; i++) {
		  var param = splitUrl[i];
		  if(param.indexOf("errorCode") != -1) {
			  codeErreur = param.split("=")[1];
		  } else if(param.indexOf("blocage_date") != -1) {
			  blocageDate = param.split("=")[1];
		  } else if(param.indexOf("blocage_heure") != -1) {
			  blocageHeure = param.split("=")[1];
		  }
		}
		generationOTPKO(codeErreur, blocageDate, blocageHeure);
		griserBouton(codeErreur,'authentification');
	}
}

//Traitement specifique IE pour envoyer un code OTP
function envoyerCode() {
	document.getElementById('j_etape').value="ENVOYER_OTP";
	//On d�sactive le bouton le temps de l'appel
	document.getElementById('BoutonGenerationOTP').disabled=true;
	//On cache l'�ventuel ancien message
	document.getElementById('MessageGenerationOTP').style.display="none";
	document.getElementById('MessageGenerationOTPOK').style.display="none";
	if(document.getElementById('divErreur') != null) {
		document.getElementById('divErreur').classList.add('invisible');
	}
	document.forms['authent_form'].submit();
}

//Traitement specifique IE pour afficher 
function afficherGenerationOTPforIE(resultat, blocageDate, blocageHeure) {
	//Ouvrir le volet deroulant
	document.getElementById('panneau-otp').style.display="block";
	document.getElementById('lienInfoOTP').setAttribute('aria-expanded', true);
	if(resultat === 'OK') {
		generationOTPOK();
	} else {
		generationOTPKO(resultat, blocageDate, blocageHeure);
		//On cache le message d'erreur dans la div divErreur
		if(document.getElementById('divErreur') != null) {
			document.getElementById('divErreur').style.display="none";
		}
		//On grise les boutons plus tard dans la jsp
	}
}
//Afficher le message ok en retour de generation OTP
function generationOTPOK() {
	//On affiche le message ok
	document.getElementById('MessageGenerationOTPOK').style.display="block";
	//On r�active le bouton
	document.getElementById('BoutonGenerationOTP').disabled=false;
}
//Afficher le message ko en retour de generation OTP
function generationOTPKO(codeErreur, blocageDate, blocageHeure) {
	//L'�l�ment qui va afficher le message d'erreur
	var elementErreur = document.getElementById('MessageGenerationOTP');
	//Construction du message d'erreur
	var message = messages[codeErreur];
	message = message.replace('{0}', blocageDate).replace('{1}', blocageHeure);
	elementErreur.innerHTML = message;
	elementErreur.style.display="block";
}

/* ********** G�n�rique ********** */

//Permet de supprimer le message d'erreur et la mise en forme CSS d'erreur
function champOK(champ, champMessageErreur) {
	// On supprime la classe CSS pour les erreurs
	var elementRef = document.getElementById(champ);
	elementRef.classList.remove('erreur_champ');
	// On supprime le message d'erreur et on ajoute la classe qui rend invisible la zone d'erreur
	var elementErreur = document.getElementById(champMessageErreur);
	elementErreur.innerHTML = "";
	elementErreur.classList.add('messageErreur_invisible');
}

//Permet d'afficher le message d'erreur et d'ajouter la mise en forme CSS d'erreur
function erreurChamp(champ, messageErreur, champMessageErreur) {
    if (messageErreur.length !== 0) {
    	// On ajoute la classe CSS pour les erreurs
    	var elementRef = document.getElementById(champ);
    	elementRef.classList.add('erreur_champ');
        // On ajoute le message d'erreur dans la zone pr�vue et on supprime la classe qui la rend invisible
    	var elementErreur = document.getElementById(champMessageErreur);
    	elementErreur.innerHTML = messageErreur;
    	elementErreur.classList.remove('messageErreur_invisible');
    }
}

//Authentification renforcee : calcule si le bouton de connexion doit �tre actif ou non selon le remplissage du formulaire
function enableBouton(typeVitale) {
	var resultat = false;
	var listeVitale; 
	var erreurVitale;
	if(typeVitale === 'VITALE_2') {
		listeVitale = liste_vitale_2;
		erreurVitale = erreur_vitale_2;
	} else {
		listeVitale = liste_vitale_1;
		erreurVitale = erreur_vitale_1;
	}
	if(!controleNumeroSerie(document.getElementById('numSerieVitale'), erreurVitale, listeVitale)) {
		resultat = true;
	}
	if(controleOTP(document.getElementById('numOTP1'))
		&& controleOTP(document.getElementById('numOTP2'))
		&& controleOTP(document.getElementById('numOTP3'))
		&& controleOTP(document.getElementById('numOTP4'))) {
		champOK('erreurZoneOTP', 'messageErreurOTP');
	} else {
		resultat = true;
	}
	document.getElementById("boutonConnect").disabled = resultat;
}

// Permet de griser des boutons et des champs selon le codeErreur
function griserBouton(codeErreur,etape) {
	if(codeErreur != null && codeErreur != '') {
		if(codeErreur != 'IDENTIFICATION_MULTIPLE' && codeErreur != 'MAUVAIS_MDP'
			&& codeErreur != 'KO_OTP_AUTHENT' && codeErreur != 'KO_OTP_TIMEOUT'
			&& codeErreur != 'KO_VITALE_AUTHENT' && codeErreur != 'IDENTIFICATION_NIR_INCONNU_DNA'
			&& codeErreur != 'AUTORISATION_KO' && codeErreur != 'IDENTIFICATION_NIR_INEXISTANT_W4'
			&& codeErreur != 'IDENTIFICATION_CONFLIT') {
			//On desactive le bouton de connexion
			document.getElementById('boutonConnect').disabled=true;
			//Si on est dans la 2eme etape
			if(etape === 'authentification') {
				//On d�sactive le bouton de generation de code
				document.getElementById('BoutonGenerationOTP').disabled=true;
				//On grise les champs de saisie
				document.getElementById('numSerieVitale').disabled=true;
				document.getElementById('numOTP1').disabled=true;
				document.getElementById('numOTP2').disabled=true;
				document.getElementById('numOTP3').disabled=true;
				document.getElementById('numOTP4').disabled=true;
			}
		}
	}
}

function testNavigateur() {
	var ua = navigator.userAgent,
	    index,
	    navigateur,
	    version;
	if((index = ua.indexOf('Firefox'))>=0) {
	    navigateur = 'Firefox';
	    version = ua.match(/Firefox\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('MSIE'))>=0) {
		//IE 10 et moins
	    navigateur = 'IE';
	    version = ua.match(/MSIE ([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Chrome'))>=0) {
	    navigateur = 'Google Chrome';
	    version = ua.match(/Chrome\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Opera'))>=0) {
	    navigateur = 'Opera';
	    version = ua.match(/Version\/([0-9]+(?:\.[0-9]+)*)/)[1] || ua.match(/Opera\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Safari'))>=0) {
	    navigateur = 'Safari';
	    version = ua.match(/Version\/([0-9]+(?:\.[0-9]+)*)/)[1] || ua.match(/Safari\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('rv:11.0'))>=0) {
		//IE 11
		navigateur = 'IE';
	} else {
		navigateur = 'Inconnu';
	}
	//Traitement specifique pour IE qui traite mal la fonction ajax
	if(navigateur === 'IE') {
		document.getElementById('BoutonGenerationOTP').onclick=envoyerCode;
	}
	return navigateur;
}

//Permet d'afficher/masquer le mot de passe
function afficherMotDePasse(passwordId, image){
	var element = document.getElementById(passwordId);
	var image = document.getElementById("j_password_icone");
	if (element.type === "password") {
		element.type = "text";
		image.setAttribute("src", "/FRCO-app/resources/images/Oeil.png");
		image.setAttribute("title", "Masquer le code");
	} else {
		element.type = "password";
		image.setAttribute("src", "/FRCO-app/resources/images/OeilBarre.png");
		image.setAttribute("title", "Afficher le code");
	}
}

function onSubmit(token) {
	document.getElementById('connexion_form').submit();
}

//************************************************
//TODO a supprimer une fois le captcha en place **
//************************************************
//Methode pour appeler la fonction d'envoi d'un code OTP
function ajaxCallRemoteEnvoyerOTP(context, evenement, nir, ddn, rang, process){
	//On desactive le bouton le temps de l'appel
	document.getElementById('BoutonEnvoyerOTP').disabled=true;
	//On cache l'eventuel ancien message
	//document.getElementById('MessageGenerationOTP').style.display="none";
	//document.getElementById('MessageGenerationOTPOK').style.display="none";
	if(document.getElementById('divErreur') != null) {
		document.getElementById('divErreur').classList.add('invisible');
	}
	var functionActionUrl = context + '/j_spring_security_check';
	
	var params = "input=OTP&j_username="+encodeURIComponent(nir.value)+"&j_process="+encodeURIComponent(process)+"&j_etape="+encodeURIComponent("AUTHENT_OTP");
	
	if (window.XMLHttpRequest)
	{	// Non-IE browsers
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{	// IE
		req = new ActiveXObject('Microsoft.XMLHTTP');
	}
	req.open('POST', functionActionUrl, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.onreadystatechange = afficherConfirmationOTPnew;
	req.send(params);
	return;
}

//Des qu'une valeur est entree dans un champ OTP, on verifie si on doit activer le bouton de connexion
//et si la valeur est autorisee
function saisieAuthentOTP(event, current) {
	if ((event.which && event.which != 13) && (event.keyCode && event.keyCode != 13)){
		var resultat = false;
		if(controleOTP(document.getElementById('numOTP1'))
			&& controleOTP(document.getElementById('numOTP2'))
			&& controleOTP(document.getElementById('numOTP3'))
			&& controleOTP(document.getElementById('numOTP4'))
			&& controleOTP(document.getElementById('numOTP5'))
			&& controleOTP(document.getElementById('numOTP6'))) {
			champOK('erreurZoneOTP', 'messageErreurOTP');
		} else {
			resultat = true;
		}
		document.getElementById("boutonConnect").disabled = resultat;
	}
	Autotab(current, "numOTP", event, erreur_otp_format6);
}

function checkAffichageOTP(authentEtape, errorCode) {
	if(authentEtape == "CHECK_OTP" && errorCode != "KO_OTP_TIMEOUT") {
		document.getElementById('blocEnvoyerOTP').classList.add('invisible');
		document.getElementById('blocSaisieOTP').classList.remove('invisible');
	}
}
//Permet de griser des boutons et des champs selon le codeErreur
function supprimerBoutonConnectOTP(authentCode, etape) {
	if(authentCode != null && authentCode != '' 
		&& authentCode == 'SECONDE_AUTHENT_NECESSAIRE' && (etape == null || etape == '')) {
			//On desactive le bouton de connexion
			document.getElementById('divBoutonConnect').classList.add('invisible');
	}
}
//Permet de griser des boutons et des champs selon le codeErreur
function griserBoutonConnectOTP(authentCode, codeErreur) {
	//Si on est dans la 2eme etape
	if(authentCode == 'SECONDE_AUTHENT_NECESSAIRE') {
		//On desactive le bouton de connexion
		document.getElementById('boutonConnect').disabled=true;
		if(codeErreur != null && codeErreur != '') {
			if(codeErreur == 'KO_NB_CODES_MAX' || codeErreur == 'BLOQUE_INITIALISATION' 
				|| codeErreur == 'KO_INITIALISATION' || codeErreur == 'BLOQUE_AUTHENT'
				|| codeErreur == 'KO_NB_ESSAIS_MAX') {
				//On grise les champs de saisie
				document.getElementById('numOTP1').disabled=true;
				document.getElementById('numOTP2').disabled=true;
				document.getElementById('numOTP3').disabled=true;
				document.getElementById('numOTP4').disabled=true;
				document.getElementById('numOTP5').disabled=true;
				document.getElementById('numOTP6').disabled=true;
			}
		}
	}
}
function afficherConfirmationOTPnew() {
	if (req.readyState == 4)
	{ 	// Complete
		if (req.status == 200)
		{ 	// OK response
			afficherMessageOTPnew(req);
		 }
	}
}
//Methode qui va traiter la r�ponse de l'appel � la g�n�ration d'un nouvel OTP
function afficherMessageOTPnew(req){
	//On recupere les params de l'url
	var splitUrl = req.responseURL.split('&');
	var taille = splitUrl.length;
	//Si pas de params -> reponse OK
	if(taille == 1) {
		//On affiche le bloc de saisie
		document.getElementById('blocSaisieOTP').classList.remove('invisible');
		//On cache le bloc avec le bouton d'envoi
		document.getElementById('blocEnvoyerOTP').classList.add('invisible');
		//On affiche à nouveau le bouton de connexion mais on le grise
		document.getElementById('divBoutonConnect').classList.remove('invisible');
		document.getElementById('boutonConnect').disabled=true;
		document.getElementById('numOTP1').focus();
	}
	else {
		//Si params -> reponse KO
		var codeErreur = null;
		var blocageDate = null;
		var blocageHeure = null;
		//On boucle sur les params pour recuperer les differentes valeurs
		for (var i=0; i<taille; i++) {
		  var param = splitUrl[i];
		  if(param.indexOf("errorCode") != -1) {
			  codeErreur = param.split("=")[1];
		  } else if(param.indexOf("authentCode") != -1) {
			  codeAuthent = param.split("=")[1];
		  } else if(param.indexOf("blocage_date") != -1) {
			  blocageDate = param.split("=")[1];
		  } else if(param.indexOf("blocage_heure") != -1) {
			  blocageHeure = param.split("=")[1];
		  }
		}
		//L'element qui va afficher le message d'erreur
		var elementErreur = document.getElementById('MessageErreurEnvoyerOTP');
		//Construction du message d'erreur
		var message = messages[codeErreur];
		message = message.replace('{0}', blocageDate).replace('{1}', blocageHeure);
		elementErreur.innerHTML = message;
		elementErreur.style.display="block";
		var classes = document.getElementById('divErreurEnvoyerOTP').classList;
		document.getElementById('divErreurEnvoyerOTP').classList.remove('invisible');
	}
}
//En sortant d'un champ OTP, on verifie s'ils sont remplis
function saisieOTPfinieNew() {
	//Tous les champs vides
	if(!document.getElementById('numOTP1').value
		&& !document.getElementById('numOTP2').value
		&& !document.getElementById('numOTP3').value
		&& !document.getElementById('numOTP4').value
		&& !document.getElementById('numOTP5').value
		&& !document.getElementById('numOTP6').value) {
		erreurChamp('erreurZoneOTP',erreur_otp_obligatoire, 'messageErreurOTP');
	}
}

function remplirOTP(codeOTP) {
	if(codeOTP != null && codeOTP != '') {
		document.getElementById('numOTP1').value=codeOTP.substring(0,1);
		document.getElementById('numOTP2').value=codeOTP.substring(1,2);
		document.getElementById('numOTP3').value=codeOTP.substring(2,3);
		document.getElementById('numOTP4').value=codeOTP.substring(3,4);
		document.getElementById('numOTP5').value=codeOTP.substring(4,5);
		document.getElementById('numOTP6').value=codeOTP.substring(5,6);
	}
}
function testNavigateurNew() {
	var ua = navigator.userAgent,
	    index,
	    navigateur,
	    version;
	if((index = ua.indexOf('Firefox'))>=0) {
	    navigateur = 'Firefox';
	    version = ua.match(/Firefox\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('MSIE'))>=0) {
		//IE 10 et moins
	    navigateur = 'IE';
	    version = ua.match(/MSIE ([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Chrome'))>=0) {
	    navigateur = 'Google Chrome';
	    version = ua.match(/Chrome\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Opera'))>=0) {
	    navigateur = 'Opera';
	    version = ua.match(/Version\/([0-9]+(?:\.[0-9]+)*)/)[1] || ua.match(/Opera\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('Safari'))>=0) {
	    navigateur = 'Safari';
	    version = ua.match(/Version\/([0-9]+(?:\.[0-9]+)*)/)[1] || ua.match(/Safari\/([0-9]+(?:\.[0-9]+)*)/)[1];
	} else if((index = ua.indexOf('rv:11.0'))>=0) {
		//IE 11
		navigateur = 'IE';
	} else {
		navigateur = 'Inconnu';
	}
	//Traitement specifique pour IE qui traite mal la fonction ajax
	if(navigateur === 'IE') {
		traitementNavigateurIE();
	}
	return navigateur;
}

function traitementNavigateurIE() {
	//On grise le bouton de connexion et les champs
	document.getElementById('boutonConnect').disabled=true;
	document.getElementById('j_username').disabled=true;
	document.getElementById('j_password').disabled=true;
	//Affichage du message d'erreur
	var elementErreur = document.getElementById('MessageErreurEnvoyerOTP');
	//Construction du message d'erreur
	elementErreur.innerHTML = messages_internetExplorer;
	elementErreur.style.display="block";
	var classes = document.getElementById('divErreurEnvoyerOTP').classList;
	if(classes == null) {
		document.getElementById('divErreurEnvoyerOTP').className="divErreur";
	} else {
		document.getElementById('divErreurEnvoyerOTP').classList.remove('invisible');
	}
	
	
}