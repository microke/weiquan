package test.junit.service;

import org.apache.log4j.Logger;

import com.weiquan.cache.map.impl.RoleTagMapCache;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.role.RoleService;

public class RoleServiceTest extends BaseServiceTest{
	private Logger logger = Logger.getLogger(RoleServiceTest.class);
	private RoleTagMapCache roleTagMapCache;
	
	public void testRoleService(){
		try {
			this.roleTagMapCache.initCache();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public void createEntity() {
		roleTagMapCache = (RoleTagMapCache)super.context.getBean("roleTagMapCache");
		
	}

	@Override
	public void destroyEntity() {
		
	}

}
