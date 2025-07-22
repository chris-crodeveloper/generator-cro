/_
** Template Variables
_/
<%
    function outputVariables(obj, parentKey = '') {
        let output = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currentKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof obj[key] === 'object') {
                    output += outputVariables(obj[key], currentKey);
                } else {
                    output += `* ${currentKey}: ${obj[key]}\n`;
                }
            }
        }
        return output;

    }
%>

*** These are all the available template variables that can be used in your templates. 
<%= outputVariables(templateVariables) %>  


*** Variation variables - these are dynamically set when generating the variation files
* variations.currentVariation.index 
* variations.currentVariation.name 
* variations.currentVariation.filename 
* variations.currentVariation.id 

