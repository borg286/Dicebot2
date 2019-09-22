"use strict";const JSON_URL="data/optionalfeatures.json";window.onload=async function(){await ExcludeUtil.pInitialise(),SortUtil.initHandleFilterButtonClicks(),DataUtil.loadJSON(JSON_URL).then(onJsonLoad)};function optFeatSort(a,b,c){if("level"===c.valueName){const d=+a.values().level.toLowerCase()||0,e=+b.values().level.toLowerCase()||0;return SortUtil.ascSort(d,e)||SortUtil.listSort(a,b,c)}return SortUtil.listSort(a,b,c)}function filterFeatureTypeSort(c,a){return SortUtil.ascSort(Parser.optFeatureTypeToFull(c.item),Parser.optFeatureTypeToFull(a.item))}let list;const sourceFilter=getSourceFilter(),typeFilter=new Filter({header:"Feature Type",items:["AI","ED","EI","MM","MV:B","OTH","FS:F","FS:B","FS:P","FS:R","PB"],displayFn:Parser.optFeatureTypeToFull,itemSortFn:filterFeatureTypeSort}),pactFilter=new Filter({header:"Pact Boon",items:["Blade","Chain","Tome"],displayFn:Parser.prereqPactToFull}),patronFilter=new Filter({header:"Otherworldly Patron",items:["The Archfey","The Fiend","The Great Old One","The Hexblade","The Kraken","The Raven Queen","The Seeker"],displayFn:Parser.prereqPatronToShort}),spellFilter=new Filter({header:"Spell",items:["eldritch blast","hex/curse"],displayFn:StrUtil.toTitleCase}),featureFilter=new Filter({header:"Feature",displayFn:StrUtil.toTitleCase}),levelFilter=new Filter({header:"Level",itemSortFn:SortUtil.ascSortNumericalSuffix,nests:[]}),prerequisiteFilter=new MultiFilter({header:"Prerequisite",filters:[pactFilter,patronFilter,spellFilter,levelFilter,featureFilter]});let filterBox;async function onJsonLoad(a){filterBox=await pInitFilterBox({filters:[sourceFilter,typeFilter,prerequisiteFilter]}),list=ListUtil.search({valueNames:["name","source","prerequisite","level","type","uniqueid"],listClass:"optfeatures",sortFunction:optFeatSort});const b=$(`.lst__wrp-search-visible`);list.on("updated",()=>{b.html(`${list.visibleItems.length}/${list.items.length}`)}),$(filterBox).on(FilterBox.EVNT_VALCHANGE,handleFilterChange);ListUtil.initSublist({valueNames:["name","ability","prerequisite","level","id"],listClass:"suboptfeatures",getSublistRow:getSublistItem,sortFunction:optFeatSort});ListUtil.initGenericPinnable(),addOptionalfeatures(a),BrewUtil.pAddBrewData().then(handleBrew).then(()=>BrewUtil.bind({list})).then(()=>BrewUtil.pAddLocalBrewData()).catch(BrewUtil.pPurgeBrew).then(async()=>{BrewUtil.makeBrewButton("manage-brew"),BrewUtil.bind({filterBox,sourceFilter}),await ListUtil.pLoadState(),RollerUtil.addListRollButton(),ListUtil.addListShowHide(),History.init(!0),ExcludeUtil.checkShowAllExcluded(optfList,$(`#pagecontent`))})}function handleBrew(a){return addOptionalfeatures(a),Promise.resolve()}let optfList=[],ivI=0;function addOptionalfeatures(a){if(!a.optionalfeature||!a.optionalfeature.length)return;optfList=optfList.concat(a.optionalfeature);let b="";for(;ivI<optfList.length;ivI++){const a=optfList[ivI];ExcludeUtil.isExcluded(a.name,"optionalfeature",a.source)||(a.featureType=a.featureType||"OTH",a.prerequisite&&(a._sPrereq=!0,a._fPrereqPact=a.prerequisite.filter(a=>"prereqPact"===a.type).map(a=>(pactFilter.addItem(a.entry),a.entry)),a._fPrereqPatron=a.prerequisite.filter(a=>"prereqPatron"===a.type).map(a=>(patronFilter.addItem(a.entry),a.entry)),a._fprereqSpell=a.prerequisite.filter(a=>"prereqSpell"===a.type).map(a=>(spellFilter.addItem(a.entries),a.entries)),a._fprereqFeature=a.prerequisite.filter(a=>"prereqFeature"===a.type).map(a=>(featureFilter.addItem(a.entries),a.entries)),a._fPrereqLevel=a.prerequisite.filter(a=>"prereqLevel"===a.type).map(a=>{const b=new FilterItem({item:`${a.class.name}${a.subclass?` (${a.subclass.name})`:""} Level ${a.level}`,nest:a.class.name});return levelFilter.addNest(a.class.name,{isHidden:!0}),levelFilter.addItem(b),b})),a.featureType instanceof Array?(a._dFeatureType=a.featureType.map(a=>Parser.optFeatureTypeToFull(a)),a._lFeatureType=a.featureType.join(", "),a.featureType.sort((c,a)=>SortUtil.ascSortLower(Parser.optFeatureTypeToFull(c),Parser.optFeatureTypeToFull(a)))):(a._dFeatureType=Parser.optFeatureTypeToFull(a.featureType),a._lFeatureType=a.featureType),b+=`
			<li class="row" ${FLTR_ID}="${ivI}" onclick="ListUtil.toggleSelected(event, this)" oncontextmenu="ListUtil.openContextMenu(event, this)">
				<a id="${ivI}" href="#${UrlUtil.autoEncodeHash(a)}" title="${a.name}">
					<span class="name col-3-2 pl-0">${a.name}</span>
					<span class="type col-1-5 text-center type" title="${a._dFeatureType}">${a._lFeatureType}</span>
					<span class="prerequisite col-4-8">${Renderer.optionalfeature.getPrerequisiteText(a.prerequisite,!0)}</span>
					<span class="level col-1 text-center">${Renderer.optionalfeature.getListPrerequisiteLevelText(a.prerequisite)}</span>
					<span class="source col-1-5 ${Parser.sourceJsonToColor(a.source)} text-center pr-0" title="${Parser.sourceJsonToFull(a.source)}" ${BrewUtil.sourceJsonToStyle(a.source)}>${Parser.sourceJsonToAbv(a.source)}</span>
					
					<span class="uniqueid hidden">${a.uniqueId?a.uniqueId:ivI}</span>
				</a>
			</li>
		`,sourceFilter.addItem(a.source),typeFilter.addItem(a.featureType))}const c=ListUtil.getSearchTermAndReset(list);$(`#optfeaturesList`).append(b),list.reIndex(),c&&list.search(c),list.sort("name"),filterBox.render(),handleFilterChange(),ListUtil.setOptions({itemList:optfList,getSublistRow:getSublistItem,primaryLists:[list]}),ListUtil.bindPinButton(),Renderer.hover.bindPopoutButton(optfList),UrlUtil.bindLinkExportButton(filterBox),ListUtil.bindDownloadButton(),ListUtil.bindUploadButton()}function handleFilterChange(){const a=filterBox.getValues();list.filter(function(b){const c=optfList[$(b.elm).attr(FLTR_ID)];return filterBox.toDisplay(a,c.source,c.featureType,[c._fPrereqPact,c._fPrereqPatron,c._fprereqSpell,c._fPrereqLevel,c._fprereqFeature])}),FilterBox.selectFirstVisible(optfList)}function getSublistItem(a,b){return`
		<li class="row" ${FLTR_ID}="${b}" oncontextmenu="ListUtil.openSubContextMenu(event, this)">
			<a href="#${UrlUtil.autoEncodeHash(a)}" title="${a.name}">
				<span class="name col-4 pl-0">${a.name}</span>
				<span class="source col-2 text-center type" title="${Parser.optFeatureTypeToFull(a.featureType)}">${a.featureType}</span>
				<span class="prerequisite col-4-5">${Renderer.optionalfeature.getPrerequisiteText(a.prerequisite,!0)}</span>
				<span class="level col-1-5 pr-0">${Renderer.optionalfeature.getListPrerequisiteLevelText(a.prerequisite)}</span>
				
				<span class="id hidden">${b}</span>
			</a>
		</li>
	`}function loadHash(a){Renderer.get().setFirstSection(!0);const b=$(`#pagecontent`).empty(),c=optfList[a],d=$(`#stat-tabs`);d.find(`.opt-feature-type`).remove();const e=$(`<div class="opt-feature-type"/>`).prependTo(d);if(c.featureType instanceof Array){const a=MiscUtil.findCommonPrefix(c.featureType.map(a=>Parser.optFeatureTypeToFull(a)));a&&e.append(`${a.trim()} `),c.featureType.forEach((b,c)=>{0<c&&e.append("/"),$(`<span class="roller">${Parser.optFeatureTypeToFull(b).substring(a.length)}</span>`).click(()=>{filterBox.setFromValues({"Feature Type":{[b]:1}}),handleFilterChange()}).appendTo(e)})}else $(`<span class="roller">${Parser.optFeatureTypeToFull(c.featureType)}</span>`).click(()=>{filterBox.setFromValues({"Feature Type":{[c.featureType]:1}}),handleFilterChange()}).appendTo(e);b.append(`
		${Renderer.utils.getBorderTr()}
		${Renderer.utils.getNameTr(c)}
		${c.prerequisite?`<tr><td colspan="6"><i>${Renderer.optionalfeature.getPrerequisiteText(c.prerequisite)}</i></td></tr>`:""}
		<tr><td class="divider" colspan="6"><div></div></td></tr>
		<tr><td colspan="6">${Renderer.get().render({entries:c.entries},1)}</td></tr>
		${Renderer.optionalfeature.getPreviouslyPrintedText(c)}
		${Renderer.utils.getPageTr(c)}
		${Renderer.utils.getBorderTr()}
	`),ListUtil.updateSelected()}function loadSubHash(a){a=filterBox.setFromSubHashes(a),ListUtil.setFromSubHashes(a)}