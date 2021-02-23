import Vue from "vue";
import { Button } from "element-ui";

// form
import { Form, FormItem } from "element-ui";
import {  Input,  } from "element-ui";
// message 弹窗
import {Message} from  'element-ui'

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

Vue.prototype.$message = Message
