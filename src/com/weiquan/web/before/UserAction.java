package com.weiquan.web.before;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.User;
import com.weiquan.service.user.UserService;

@Controller
@RequestMapping("/user")
@SessionAttributes(WqDataDictionary.SESSION_KEY_USER)
public class UserAction {
	private UserService userService;
	@InitBinder("user")    
    public void initBinder2(WebDataBinder binder) {    
            binder.setFieldDefaultPrefix("user.");    
    } 
	
	@RequestMapping("/login")
	public String login(@RequestParam("user")User user, Model mav){
		User currUser = this.userService.validLoginUser(user);
		mav.addAttribute(WqDataDictionary.SESSION_KEY_USER, currUser);
        return "background/main/Main.jsp" ;
	}
	@RequestMapping("/backgroud/init")  
	public String loginInit(Model model){
		User user = new User();  
        model.addAttribute("user",user);  
		return "/jsp/backgroud/Login.jsp";
	} 
	

	
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}
