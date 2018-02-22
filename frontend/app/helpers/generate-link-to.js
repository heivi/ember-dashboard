import { helper } from '@ember/component/helper';


export function generateLinkTo([currentRoute, route, name]) {
  
  if (route == currentRoute) {
    return '{{#link-to "'+route+'" class="nav-link active"}}'+name+'{{/link-to}}'
  } else {
    return '{{#link-to "'+route+'" class="nav-link"}}'+name+'{{/link-to}}'
  }
}

export default helper(generateLinkTo);
