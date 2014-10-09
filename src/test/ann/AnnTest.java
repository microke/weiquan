package test.ann;

import java.lang.reflect.Field;
import java.util.Map;

import test.junit.service.BaseServiceTest;

import com.weiquan.domain.AttrMapping;
import com.weiquan.domain.Image;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.annotation.AttrAnnotation;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.attrmapping.AttrMappingCacheInitInterface;
import com.weiquan.util.JsonUtil;

public class AnnTest extends BaseServiceTest{
	private AttrMappingCacheInitInterface attrMappingCacheInitInterface;
	
	public void testInsert(){
		
		/*this.attrMappingCacheInitInterface.initProxyObject(new String[]{"com.weiquan.domain"}, null, null);
		
		 Map<String, AttrMapping>  map = this.attrMappingCacheInitInterface.initAttrMapping();
		 System.out.println(JsonUtil.toJsonObject(map));
		 super.assertNotNull(map);
		*/
	}

	@Override
	protected String getContextPath() {
		return "/test/application.xml";
	}

	@Override
	public void createEntity() {
		this.attrMappingCacheInitInterface = (AttrMappingCacheInitInterface)super.context.getBean("attrMappingService");
		
	}

	@Override
	public void destroyEntity() {
		// TODO Auto-generated method stub
		
	}
}
