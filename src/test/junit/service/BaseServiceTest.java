package test.junit.service;

import java.util.HashMap;
import java.util.Map;

import junit.framework.TestCase;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public abstract class BaseServiceTest extends TestCase {
	protected static Logger LOGGER = Logger.getLogger(BaseServiceTest.class); 
	public static  boolean IS_JUNIT_TEST = false; // 这里的false不要改，在junit初始化时会自动设置成true
	public static final Object IS_JUNIT_TEST_LOCK = new Object();	
	protected ApplicationContext context; // spring context
	protected Map<String, Object> session = new HashMap<String, Object>();
	public static String SESSION_KEY_USER = "USER";
	
	protected String getContextPath(){	return "/test/application.xml";}
	
	public void initEnvironment() {
		try {
			context = new ClassPathXmlApplicationContext(new String[] {
					getContextPath() });
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	
	/**初始化实例 */
	public abstract  void createEntity();
	
	/** 销毁实例 */
	public abstract void destroyEntity();
	
	protected void setUp() throws Exception {
		synchronized (BaseServiceTest.IS_JUNIT_TEST_LOCK) {
			BaseServiceTest.IS_JUNIT_TEST = true;
			initEnvironment();
			createEntity();
		}
	}

	protected void tearDown() throws Exception {
		destroyEntity();
	}

}
