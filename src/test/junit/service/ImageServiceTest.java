package test.junit.service;

import com.weiquan.domain.Image;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.image.ImageService;

public class ImageServiceTest extends BaseServiceTest{
	private ServiceCommonInterface<Image> imageService;
	
	public void testInsert(){
		Image image = new Image();
		image.setImageId(1);
		image.setFileName("logo.jsp");
		image.setDirectory("E:\\asdasd\\");
		this.imageService.insert(image);
//		this.imageService.updateImage(image)
//		this.imageService.getImageInfoById(image);
		System.out.println(image.getImageId());
		super.assertTrue(image.getImageId() != 0);
		
	}

	@Override
	protected String getContextPath() {
		return "/test/application.xml";
	}

	@Override
	public void createEntity() {
		this.imageService = (ServiceCommonInterface<Image>)super.context.getBean("imageService");
		
	}

	@Override
	public void destroyEntity() {
		// TODO Auto-generated method stub
		
	}
}
