(window.webpackJsonp=window.webpackJsonp||[]).push([[135],{1296:function(t,e,i){Object.defineProperty(e,"__esModule",{value:!0});var n=i(11),r=i(1),o=i(35),a=i(19),h=i(16),u=i(33),s=i(23),m=i(116),g=i(327),l=i(56),p=i(1846),d=i(1847),f=function(t){function ImageThumbnailComponent(e,i){var n=t.call(this,e,i)||this;return n.state={loading:!0},n.requests=a.pool(),n.requests.flatMapLatest((function(t){return t.iri?n.loadImageOrRegion(t):a.never()})).onValue((function(t){return n.setState({loading:!0,thumbnail:t})})).onError((function(t){return n.setState({loading:!1,error:t})})),n}return n.__extends(ImageThumbnailComponent,t),ImageThumbnailComponent.prototype.loadImageOrRegion=function(t){var e=t.iri,i=t.imageIdPattern,n=t.iiifServerUrl,r=t.width,o=t.height,a=t.format,h=t.region,s=u.fromNullable(this.context.semanticContext).map((function(t){return t.repository})).getOrElse("default");return d.queryIIIFImageOrRegion(e,i,[s],h).flatMap((function(t){return p.queryImageBounds(n,t.imageId).map((function(e){return{info:t,bounds:e}}))})).map((function(t){var e=t.info,i=t.bounds,h={imageId:e.imageId,format:a||"jpg"},u=e.isRegion&&e.boundingBox?computeDisplayedRegionWithMargin(e.boundingBox,i,.05):void 0;return h.region=u,(r||o)&&(h.size=new p.Size.BestFit(r,o)),{iiifUri:p.constructImageUri(n,h),info:e,requestedRegion:u}}))},ImageThumbnailComponent.prototype.componentDidMount=function(){this.requestThumbnail(this.props)},ImageThumbnailComponent.prototype.componentWillReceiveProps=function(t){h.isEqual(t,this.props)||this.requestThumbnail(t)},ImageThumbnailComponent.prototype.requestThumbnail=function(t){var e=this.props,i=e.bbox,n=e.viewport,r=e.svg;this.requests.plug(a.constant({iri:s.Rdf.iri(t.imageOrRegion),imageIdPattern:t.imageIdPattern,iiifServerUrl:t.iiifServerUrl,width:this.props.width?Number(this.props.width):void 0,height:this.props.height?Number(this.props.height):void 0,format:this.props.format,region:this.props.bbox?{bbox:i,viewport:n,svg:r}:void 0}))},ImageThumbnailComponent.prototype.componentWillUnmount=function(){this.requests.plug(a.constant({}))},ImageThumbnailComponent.prototype.render=function(){var t=this.props.preserveImageSize?void 0:"100%",e=this.props,i=e.width,r=e.height,a=e.style;return void 0===i&&(i=t),void 0===r&&(r=t),o.div({className:"image-thumbnail",style:n.__assign({width:i,height:r},a)},this.renderChild())},ImageThumbnailComponent.prototype.renderChild=function(){var t=this;if(this.state.loading){var e=this.state.thumbnail?o.img({src:this.state.thumbnail.iiifUri,style:{display:"none"},onLoad:function(e){return t.onImageLoad(e)},onError:function(){return t.setState((function(t){return{loading:!1,thumbnail:t.thumbnail,error:"Failed to load image at URI '"+t.thumbnail.iiifUri+"'."}}))}}):null;return o.div({},r.createElement(g.Spinner),e)}return this.state.error?r.createElement(m.ErrorNotification,{errorMessage:this.state.error}):this.state.thumbnail?this.renderImage(this.state.thumbnail):o.span({},this.props.imageOrRegion)},ImageThumbnailComponent.prototype.onImageLoad=function(t){var e=t.target;this.setState((function(t){return{loading:!1,thumbnail:{iiifUri:t.thumbnail.iiifUri,info:t.thumbnail.info,requestedRegion:t.thumbnail.requestedRegion,naturalSize:{width:e.naturalWidth,height:e.naturalHeight}}}}))},ImageThumbnailComponent.prototype.renderImage=function(t){var e=this,i=Boolean(t.info.svgContent),n=t.naturalSize,r=n.width,a=n.height,h=this.props.preserveImageSize?t.naturalSize:{width:"100%",height:"100%"};return o.svg({style:{verticalAlign:"middle",width:h.width,height:h.height},preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 "+r+" "+a},o.image({xlinkHref:t.iiifUri,width:r,height:a}),i?o.g({dangerouslySetInnerHTML:t.info.svgContent,ref:function(i){return e.renderSVGOverlay(i,t)}}):void 0)},ImageThumbnailComponent.prototype.renderSVGOverlay=function(t,e){if(t){var i=t.firstChild,n=e.requestedRegion;i.setAttribute("viewBox",n.x+" "+n.y+" "+n.width+" "+n.height),i.setAttribute("width",String(e.naturalSize.width)),i.setAttribute("height",String(e.naturalSize.height)),function overrideOverlayStrokeWidth(t,e){for(var i=t.querySelectorAll("path"),n=0;n<i.length;n++)i[n].setAttribute("stroke-width",e)}(i,"2%")}},ImageThumbnailComponent}(l.Component);function computeDisplayedRegionWithMargin(t,e,i){var n=Math.max(t.width*i,t.height*i);return new p.Region.Absolute(Math.max(t.x-n,0),Math.max(t.y-n,0),Math.min(t.width+2*n,e.width),Math.min(t.height+2*n,e.height))}e.computeDisplayedRegionWithMargin=computeDisplayedRegionWithMargin,e.component=f,e.factory=r.createFactory(e.component),e.default=e.component}}]);
//# sourceMappingURL=rs-iiif-image-thumbnail-2d6bdd699ebf6abec41c.js.map