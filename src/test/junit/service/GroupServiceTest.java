package test.junit.service;

import com.weiquan.domain.Group;
import com.weiquan.domain.Image;
import com.weiquan.service.ServiceCommonInterface;

public class GroupServiceTest extends BaseServiceTest{
	private ServiceCommonInterface<Group> service;
	
	public void testInsert(){
		Group group = this.service.getInfoById(404);
		System.out.println("123");
	}

	@Override
	protected String getContextPath() {
		return "/test/application.xml";
	}

	@Override
	public void createEntity() {
		this.service = (ServiceCommonInterface<Group>)super.context.getBean("groupService");
		
	}

	@Override
	public void destroyEntity() {
		// TODO Auto-generated method stub
		
	}
}
