<?php

namespace App\Libraries;

class EmailTemplate{
    
    function generate($email_body){
        $email_top = $this->template_top();
        $email_bottom = $this->template_bottom();
        
        return $email_top.$email_body.$email_bottom;
    }//end generate
    
    private function template_top(){
        //new user
        $template_top =
        '<table style="font-family:Source Sans Pro,Arial,Helvetica;font-size:16px;font-weight:400;padding:15px;border:1px solid #ccc;background:#fafafa;min-width:380px;width:auto;max-width:800px;">'.
        '<tr>'.
        '<td align="left" width="70"><img src="'.url('').'/public/images/logo.png" width="60"></td>'.
        '<td align="left">'.
        '<div style="font-size:18px;font-weight:800;color:#0E3151;font-style:italic;padding-bottom:3px;border-bottom: 2px solid #0E3151;">'.GlobalData::APP_NAME.'</div>'.
        '<div style="font-size:16px;font-weight:600;color:#0E3151;font-style:italic;padding-top:7px;">'.
        '<span style="color:#f85656;">Demo Tools</span>'.
        '</div>'.
        '</td>'.
        '<td align="right"><a href="'.GlobalData::APP_DOMAIN.'/help" style="letter-spacing:1px;font-size:14px;font-weight:600;color:white;background:#0073E6;padding:15px 25px;text-decoration:none;width:70px;border-radius:5px;">HELP</a></td>'.
        '</tr>'.
        '<tr><td align="center" colspan="3"><br></td></tr>';
        
        return $template_top;
    }//end template top
    
    private function template_bottom(){
        //new user
        $template_bottom =
        '<tr><td align="center" colspan="3"><br></td></tr>'.
        '<tr><td align="left" valign="top" colspan="3">Thank you,<br>'.
        '<span style="font-size:16px;font-weight:600;color:#0E3151;font-style:italic;text-decoration:underline;">'.GlobalData::APP_NAME.' TEAM</span>'.
        '</td></tr>'.
        '</table>';
        
        return $template_bottom;
    }//end template bottom
}
?>