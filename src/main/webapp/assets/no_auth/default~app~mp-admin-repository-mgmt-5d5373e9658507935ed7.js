(window.webpackJsonp=window.webpackJsonp||[]).push([[188],{1084:function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0});var n=o(11),r=o(1);o(645),o(661),o(336),o(646),o(662),o(663),o(648);var i=o(664),s=function(e){function TurtleEditorComponent(t,o){var n=e.call(this,t,o)||this;return n.onChangeTurtle=function(e,t,o){n.props.onChange?n.props.onChange(o):n.setState({source:o})},n.getTurtle=function(){return n.state.source},n.state={source:t.turtleString?t.turtleString:""},n}return n.__extends(TurtleEditorComponent,e),TurtleEditorComponent.prototype.componentWillReceiveProps=function(e){this.props.turtleString!==e.turtleString&&this.setState({source:e.turtleString})},TurtleEditorComponent.prototype.render=function(){return r.createElement(i.Controlled,{className:"turtle-editor",value:this.state.source,onBeforeChange:this.onChangeTurtle,options:n.__assign(n.__assign({},{foldGutter:!1,textAreaClassName:["form-control"],matchTags:{bothTags:!0},matchBrackets:!0}),{mode:"text/turtle",indentWithTabs:!1,indentUnit:2,tabSize:2,viewportMargin:1/0,lineNumbers:!0,lineWrapping:!0,gutters:["CodeMirror-linenumbers"]})})},TurtleEditorComponent}(r.Component);t.TurtleEditorComponent=s,t.default=s},660:function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0});var n=o(11),r=o(1),i=o(72),s=o(1),l=o(34),a=o(56),u=o(63),c=o(327),p=o(122),d=o(636),f=o(1083),m=o(1084),g=o(117),y=function(e){function RepositoryConfigEditor(t,o){var n=e.call(this,t,o)||this;return n.cancellation=new l.Cancellation,n.fetchConfig=function(e){n.setState({responseError:void 0,loadingError:void 0,submittedSuccessfully:!1,validateConfiguration:!0}),e?n.cancellation.map(p.getRepositoryConfig(e)).observe({value:function(e){return n.setState({source:e})},error:function(e){return n.setState({loadingError:e})}}):n.setState({source:void 0})},n.handleNewRepositoryID=function(e){e.preventDefault(),e.stopPropagation(),n.setState({newRepositoryID:e.target.value})},n.getNewRepositoryIDValidation=function(){if(!n.isEditMode()){var e=n.state.newRepositoryID,t=new RegExp("");return!e||e.length<5||!t.test(e)?"warning":"success"}},n.onSubmitConfig=function(){var e=n.props.id?n.props.id:n.state.newRepositoryID,t=n.refs.editor.getTurtle();p.updateOrAddRepositoryConfig(e,t,n.state.validateConfiguration).onValue((function(e){n.setState({responseError:void 0,submittedSuccessfully:!0}),u.refresh()})).onError((function(e){console.log(e),n.setState({responseError:e,submittedSuccessfully:!1})}))},n.isEditMode=function(){return!!n.props.id},n.renderTemplateSelector=function(){var e=n.props.repositoryTemplates;if(!e)return r.createElement(c.Spinner,null);var t=e.map((function(e){return r.createElement(i.MenuItem,{eventKey:e,key:e},e)}));return r.createElement(i.DropdownButton,{bsStyle:"default",title:"From template ....",onSelect:n.onTemplateSelected,id:"template-dropdown"},t)},n.selectTemplate=function(e){n.cancellation.map(p.getRepositoryConfigTemplate(e)).observe({value:function(e){n.setState({source:e,submittedSuccessfully:!1})},error:function(e){return n.setState({loadingError:e,submittedSuccessfully:!1})}})},n.onTemplateSelected=function(e,t){t.preventDefault(),t.stopPropagation(),n.selectTemplate(e)},n.executeDeleteRepository=function(e){p.deleteRepositoryConfig(e).observe({value:function(){n.setState({responseError:void 0,submittedSuccessfully:!0}),u.refresh()},error:function(e){n.setState({responseError:e,submittedSuccessfully:!1})}})},n.onDeleteRepository=function(e){var t="delete-repository-confirmation",hideDialog=function(){return g.getOverlaySystem().hide(t)},o={message:'Do you want to delete the "'+e+'" repository?',onHide:function(){hideDialog()},onConfirm:function(t){hideDialog(),t&&n.executeDeleteRepository(e)}};g.getOverlaySystem().show(t,s.createElement(d.ConfirmationDialog,o))},n.state={validateConfiguration:!0},n}return n.__extends(RepositoryConfigEditor,e),RepositoryConfigEditor.prototype.componentDidMount=function(){this.props.preselectedTemplate?this.selectTemplate(this.props.preselectedTemplate):this.fetchConfig(this.props.id)},RepositoryConfigEditor.prototype.componentWillReceiveProps=function(e){this.props.id!==e.id&&this.fetchConfig(e.id)},RepositoryConfigEditor.prototype.componentWillUnmount=function(){this.cancellation.cancelAll()},RepositoryConfigEditor.prototype.render=function(){var e=this,t=this.state,o=t.source,n=t.loadingError,s=t.responseError,l=t.submittedSuccessfully,a=this.props,u=a.showRestartPrompt,p=a.reloadPageOnSuccess,d=a.initializerMode;return n?r.createElement(i.Alert,{bsStyle:"info"}," ",n," "):this.isEditMode()&&!o?r.createElement(c.Spinner,null):r.createElement("div",{"data-flex-layout":"column top-left",className:f.holder},r.createElement("div",null,r.createElement("h4",null,this.isEditMode()?'Edit Repository Config "'+this.props.id+'"':"Create new Repository Config")),!this.isEditMode()&&r.createElement("div",null,r.createElement(i.Form,{horizontal:!0},r.createElement(i.FormGroup,{className:f.formGroup,validationState:this.getNewRepositoryIDValidation()},r.createElement("strong",null," Repository ID:"),r.createElement("br",null),r.createElement(i.FormControl,{className:f.formGroup,type:"text",value:this.state.newRepositoryID,onChange:this.handleNewRepositoryID,placeholder:"Please specify a new and unique repository id."}),this.getNewRepositoryIDValidation()&&r.createElement(i.HelpBlock,null,"Repository ID must be a unique, alphanumeric string of length >= 5 characters.")))),r.createElement("div",null,this.renderTemplateSelector()),r.createElement("div",null,r.createElement(m.TurtleEditorComponent,{ref:"editor",turtleString:o||"#Please select a template to create a new repository configuration"}),r.createElement("div",null,r.createElement("label",null,r.createElement("input",{type:"checkbox",checked:this.state.validateConfiguration,onChange:function(){return e.setState((function(e){return{validateConfiguration:!e.validateConfiguration}}))},disabled:"default"===this.props.id})," ","Validate configuration")),r.createElement(i.Button,{bsStyle:"primary",className:f.ActionButton,disabled:!this.isEditMode()&&"success"!==this.getNewRepositoryIDValidation(),onClick:this.onSubmitConfig},this.isEditMode()?"Update Config":"Create Config"),this.isEditMode()&&!d&&r.createElement(i.Button,{bsStyle:"danger",className:f.ActionButton,onClick:function(){return e.onDeleteRepository(e.props.id)}},"Delete"),s&&r.createElement(i.Alert,{bsStyle:"danger"}," ",s," "),p&&l&&window.location.reload(),u&&l&&r.createElement(i.Alert,{bsStyle:"success"}," ","The repository configuration was updated."," ")))},RepositoryConfigEditor.defaultProps={id:void 0,repositoryTemplates:[],showRestartPrompt:!1,preselectedTemplate:void 0,reloadPageOnSuccess:!1,initializerMode:!1},RepositoryConfigEditor}(a.Component);t.RepositoryConfigEditor=y,t.default=y}}]);
//# sourceMappingURL=default~app~mp-admin-repository-mgmt-5d5373e9658507935ed7.js.map