package test.junit.service;

import java.util.ArrayList;
import java.util.List;

import com.weiquan.cache.map.impl.RoleTagMapCache;
import com.weiquan.common.WqContext;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.Tag;
import com.weiquan.domain.User;
import com.weiquan.service.sheet.SheetService;
import com.weiquan.service.user.UserService;
import com.weiquan.service.viplevel.VipLevelService;

public class VipService extends BaseServiceTest{
	private WqContext wqContext;
	private VipLevelService vipLevelService;
	private UserService userService;
	@Override
	protected String getContextPath() {
		return "/test/application.xml";
	}
	
	public void testLoad(){
		User user = new User();
		user.setLoginName("zl283936851@sina.com");
		user.setPassword("zl");
		this.userService.validLoginUser(user);
	}
	
	@Override
	public void createEntity() {
		wqContext = (WqContext)super.context.getBean("wqContext");
		vipLevelService = (VipLevelService)super.context.getBean("vipLevelService");
		userService = (UserService)super.context.getBean("userService");
	}

	@Override
	public void destroyEntity() {
		
	}

}
