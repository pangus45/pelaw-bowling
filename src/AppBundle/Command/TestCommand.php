<?php

namespace AppBundle\Command;

use Imagine\Gd\Imagine;
use Imagine\Image\ImagineInterface;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Liip\ImagineBundle\Imagine\Filter\FilterManager;
use Liip\ImagineBundle\Model\FileBinary;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class TestCommand extends ContainerAwareCommand
{
// the name of the command (the part after "bin/console")
    protected static $defaultName = 'app:test-command';

    private $cacheManager;
    private $filterManager;

    public function __construct(CacheManager $pCacheManager, FilterManager $pFilterManager)
    {
        $this->cacheManager = $pCacheManager;
        $this->filterManager = $pFilterManager;

        parent::__construct();
    }

    protected function configure()
    {

// ...
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $ROOT = getcwd();

        $output->writeln($ROOT);

        $filePath = getcwd() . '/web/images/uploaded/c577f67c413d38cbd7f70de375896ac3.jpg';

        $file = new FileBinary($filePath, 'image/jpeg', 'jpg');
        // c577f67c413d38cbd7f70de375896ac3
        $newBinary = $this->filterManager->applyFilter($file, 'galleryThumb');
// ...
        file_put_contents($ROOT . '/web/images/test.jpg', $newBinary->getContent());

        $output->writeln($newBinary->getMimeType());
        $output->writeln($newBinary->getFormat());
//        $output->writeln($newBinary->getContent());

        $imagineGD = new Imagine();

        $gdImage = $imagineGD->open($filePath);

        $output->writeln($gdImage->metadata()['ifd0.Orientation']);
//        $output->writeln('Hello World');
    }
}